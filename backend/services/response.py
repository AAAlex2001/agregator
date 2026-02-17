from pathlib import Path
from uuid import uuid4

from sqlalchemy import func, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, UploadFile, status

from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole
from schemas.order import OrderResponse as OrderResponseSchema
from schemas.response import ResponseCreate, ResponseCounters, ResponseTab
from ws.manager import order_manager

ALLOWED_TECHNICAL_FILE_EXTENSIONS = {
    ".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx",
}


class ResponseService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def ensure_expert(self, expert_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == expert_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if not user.is_active or user.role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для откликов",
            )
        return user

    async def ensure_customer(self, customer_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == customer_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if not user.is_active or user.role != UserRole.CUSTOMER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для откликов",
            )
        return user

    async def get_actor(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Пользователь неактивен",
            )
        return user

    async def create_response(
        self,
        order_id: int,
        expert_id: int,
        data: ResponseCreate,
    ) -> OrderResponse:
        await self.ensure_expert(expert_id)

        order_result = await self.db.execute(
            select(Order).where(Order.id == order_id)
        )
        order = order_result.scalars().first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )

        if order.status != OrderStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя откликнуться на неактивный заказ",
            )

        existing_result = await self.db.execute(
            select(OrderResponse).where(
                OrderResponse.order_id == order_id,
                OrderResponse.expert_id == expert_id,
            )
        )
        if existing_result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Вы уже откликнулись на этот заказ",
            )

        entity = OrderResponse(
            order_id=order_id,
            expert_id=expert_id,
            comment=data.comment,
            proposed_sum_amount=data.proposed_sum_amount,
            proposed_deadline=data.proposed_deadline,
            status=ResponseStatus.NEW,
        )
        self.db.add(entity)

        try:
            await self.db.commit()
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отклик уже существует",
            )

        return await self.get_response_by_id(entity.id)

    async def update_response_status(
        self,
        response_id: int,
        actor_id: int,
        new_status: ResponseStatus,
    ) -> OrderResponse:
        actor = await self.get_actor(actor_id)
        response = await self.get_response_by_id(response_id)
        status_to_set = new_status

        if actor.role == UserRole.EXPERT:
            if response.expert_id != actor.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Нельзя изменять чужой отклик",
                )
            if new_status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Эксперт может только начать или завершить проект",
                )
            if new_status == ResponseStatus.IN_PROGRESS:
                if response.status != ResponseStatus.ACCEPTED:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="В работу можно перевести только принятый отклик",
                    )
                if not response.order or response.order.assigned_expert_id != actor.id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Нельзя начать работу по незакрепленному заказу",
                    )
            if new_status == ResponseStatus.COMPLETED:
                if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Завершить можно только отклик со статусом в работе",
                    )
                if not response.order or response.order.assigned_expert_id != actor.id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Нельзя завершить незакрепленный заказ",
                    )
                response.order.status = OrderStatus.COMPLETED
        elif actor.role == UserRole.CUSTOMER:
            if not response.order or response.order.customer_id != actor.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Нельзя изменять отклик к чужому заказу",
                )
            if new_status not in {
                ResponseStatus.REJECTED,
                ResponseStatus.ACCEPTED,
                ResponseStatus.IN_PROGRESS,
                ResponseStatus.COMPLETED,
            }:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Заказчик может только отклонять, принимать, переводить отклик в переговоры или завершать проект",
                )

            if new_status == ResponseStatus.IN_PROGRESS and response.status not in {ResponseStatus.NEW, ResponseStatus.REVIEW}:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="В переговоры можно перевести только новый отклик",
                )

            if new_status == ResponseStatus.ACCEPTED and response.status not in {
                ResponseStatus.NEW,
                ResponseStatus.REVIEW,
                ResponseStatus.IN_PROGRESS,
            }:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Выбрать исполнителем можно только отклик на рассмотрении или в переговорах",
                )

            if new_status == ResponseStatus.COMPLETED:
                if response.status not in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Завершить можно только отклик со статусом исполнитель выбран или в переговорах",
                    )
                if (
                    not response.order
                    or response.order.assigned_expert_id is None
                    or response.order.assigned_expert_id != response.expert_id
                ):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Нельзя завершить проект для незакрепленного исполнителя",
                    )
                response.order.status = OrderStatus.COMPLETED

            if new_status == ResponseStatus.ACCEPTED:
                response.order.assigned_expert_id = response.expert_id
                await self.db.execute(
                    update(OrderResponse)
                    .where(
                        OrderResponse.order_id == response.order_id,
                        OrderResponse.id != response.id,
                        OrderResponse.status != ResponseStatus.REJECTED,
                    )
                    .values(status=ResponseStatus.REJECTED)
                )
            if new_status == ResponseStatus.REJECTED and response.order.assigned_expert_id == response.expert_id:
                response.order.assigned_expert_id = None
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для изменения статуса",
            )

        response.status = status_to_set
        await self.db.commit()

        if status_to_set == ResponseStatus.REJECTED and response.order:
            order_result = await self.db.execute(
                select(Order)
                .options(selectinload(Order.badges), selectinload(Order.customer))
                .where(Order.id == response.order_id)
            )
            refreshed_order = order_result.scalars().first()
            if refreshed_order and refreshed_order.assigned_expert_id is None:
                await order_manager.broadcast({
                    "event": "order_created",
                    "data": OrderResponseSchema.from_order(refreshed_order).model_dump(),
                })

        if status_to_set == ResponseStatus.COMPLETED and response.order:
            order_result = await self.db.execute(
                select(Order)
                .options(selectinload(Order.badges), selectinload(Order.customer))
                .where(Order.id == response.order_id)
            )
            completed_order = order_result.scalars().first()
            if completed_order:
                await order_manager.broadcast({
                    "event": "order_updated",
                    "data": OrderResponseSchema.from_order(completed_order).model_dump(),
                })

        if status_to_set == ResponseStatus.ACCEPTED:
            await order_manager.broadcast({
                "event": "order_removed",
                "data": {"id": response.order_id},
            })

        return await self.get_response_by_id(response_id)

    async def update_response(
        self,
        response_id: int,
        expert_id: int,
        data: ResponseCreate,
        keep_files: list[str] | None = None,
    ) -> OrderResponse:
        """Update a NEW response (deadline, cost, comment, files)."""
        await self.ensure_expert(expert_id)
        response = await self.get_response_by_id(response_id)

        if response.expert_id != expert_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя редактировать чужой отклик",
            )

        if response.status not in {ResponseStatus.NEW, ResponseStatus.REVIEW}:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Редактировать можно только отклик на рассмотрении",
            )

        response.comment = data.comment
        response.proposed_sum_amount = data.proposed_sum_amount
        response.proposed_deadline = data.proposed_deadline

        if keep_files is not None:
            existing = list(response.technical_files or [])
            response.technical_files = [f for f in existing if f in keep_files]

        await self.db.commit()

        return await self.get_response_by_id(response_id)

    async def withdraw_response(
        self,
        response_id: int,
        expert_id: int,
    ) -> int:
        """Delete a NEW response so the expert can re-apply later.
        Returns the order_id for broadcasting."""
        response = await self.get_response_by_id(response_id)

        if response.expert_id != expert_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя отозвать чужой отклик",
            )

        if response.status not in {ResponseStatus.NEW, ResponseStatus.REVIEW, ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отозвать можно только отклик на рассмотрении, принятый или в работе",
            )

        order_id = response.order_id

        if response.order and response.order.assigned_expert_id == expert_id:
            response.order.assigned_expert_id = None
            if response.order.status != OrderStatus.ARCHIVED:
                response.order.status = OrderStatus.ACTIVE

        await self.db.delete(response)
        await self.db.commit()

        order_result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.id == order_id)
        )
        refreshed_order = order_result.scalars().first()
        if refreshed_order and refreshed_order.assigned_expert_id is None:
            await order_manager.broadcast({
                "event": "order_created",
                "data": OrderResponseSchema.from_order(refreshed_order).model_dump(),
            })

        return order_id

    async def get_response_by_id(self, response_id: int) -> OrderResponse:
        result = await self.db.execute(
            select(OrderResponse)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
            .where(OrderResponse.id == response_id)
        )
        response = result.scalars().first()
        if not response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Отклик не найден",
            )
        return response

    async def upload_response_files(
        self,
        response_id: int,
        expert_id: int,
        files: list[UploadFile],
    ) -> OrderResponse:
        response = await self.get_response_by_id(response_id)

        if response.expert_id != expert_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя загружать файлы к чужому отклику",
            )

        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не переданы файлы для загрузки",
            )

        upload_dir = (
            Path(__file__).resolve().parents[1]
            / "uploads"
            / "responses"
            / str(response_id)
        )
        upload_dir.mkdir(parents=True, exist_ok=True)

        saved_files = list(response.technical_files or [])

        for file in files:
            file_name = file.filename or ""
            extension = Path(file_name).suffix.lower()

            if extension not in ALLOWED_TECHNICAL_FILE_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Допустимые форматы: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
                )

            generated_name = f"{uuid4().hex}{extension}"
            file_path = upload_dir / generated_name

            file_content = await file.read()
            with open(file_path, "wb") as file_handle:
                file_handle.write(file_content)

            saved_files.append(f"/uploads/responses/{response_id}/{generated_name}")

        response.technical_files = saved_files
        await self.db.commit()
        await self.db.refresh(response)

        return await self.get_response_by_id(response_id)

    @staticmethod
    def statuses_for_tab(tab: ResponseTab | None) -> list[ResponseStatus] | None:
        if tab is None or tab == ResponseTab.NEW:
            return [ResponseStatus.NEW, ResponseStatus.REVIEW]
        if tab == ResponseTab.REVIEW:
            return [ResponseStatus.NEW, ResponseStatus.REVIEW]
        if tab == ResponseTab.REJECTED:
            return [ResponseStatus.REJECTED]
        if tab == ResponseTab.ACCEPTED:
            return [ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS]
        if tab == ResponseTab.COMPLETED:
            return [ResponseStatus.COMPLETED]
        if tab == ResponseTab.ARCHIVE:
            return [ResponseStatus.ARCHIVED]
        return None

    async def list_responses(
        self,
        expert_id: int,
        tab: ResponseTab | None,
        skip: int,
        limit: int,
    ) -> tuple[list[OrderResponse], int, ResponseCounters]:
        await self.ensure_expert(expert_id)

        status_filters = self.statuses_for_tab(tab)

        base_query = select(OrderResponse).where(OrderResponse.expert_id == expert_id)
        if status_filters:
            base_query = base_query.where(OrderResponse.status.in_(status_filters))

        total_query = select(func.count(OrderResponse.id)).where(
            OrderResponse.expert_id == expert_id
        )
        if status_filters:
            total_query = total_query.where(OrderResponse.status.in_(status_filters))

        total_result = await self.db.execute(total_query)
        total = total_result.scalar_one()

        list_query = (
            base_query
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
            .order_by(OrderResponse.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        list_result = await self.db.execute(list_query)
        items = list(list_result.scalars().unique().all())

        grouped = await self.db.execute(
            select(OrderResponse.status, func.count(OrderResponse.id))
            .where(OrderResponse.expert_id == expert_id)
            .group_by(OrderResponse.status)
        )

        counters_map = {status: count for status, count in grouped.all()}
        counters = ResponseCounters(
            new=counters_map.get(ResponseStatus.NEW, 0) + counters_map.get(ResponseStatus.REVIEW, 0),
            review=counters_map.get(ResponseStatus.NEW, 0) + counters_map.get(ResponseStatus.REVIEW, 0),
            rejected=counters_map.get(ResponseStatus.REJECTED, 0),
            accepted=counters_map.get(ResponseStatus.ACCEPTED, 0) + counters_map.get(ResponseStatus.IN_PROGRESS, 0),
            completed=counters_map.get(ResponseStatus.COMPLETED, 0),
            archive=counters_map.get(ResponseStatus.ARCHIVED, 0),
        )

        return items, total, counters

    async def list_customer_responses(
        self,
        customer_id: int,
        tab: ResponseTab | None,
        skip: int,
        limit: int,
    ) -> tuple[list[OrderResponse], int, ResponseCounters]:
        await self.ensure_customer(customer_id)

        status_filters = self.statuses_for_tab(tab)

        base_query = (
            select(OrderResponse)
            .join(Order, Order.id == OrderResponse.order_id)
            .where(Order.customer_id == customer_id)
        )
        if status_filters:
            base_query = base_query.where(OrderResponse.status.in_(status_filters))

        total_query = (
            select(func.count(OrderResponse.id))
            .join(Order, Order.id == OrderResponse.order_id)
            .where(Order.customer_id == customer_id)
        )
        if status_filters:
            total_query = total_query.where(OrderResponse.status.in_(status_filters))

        total_result = await self.db.execute(total_query)
        total = total_result.scalar_one()

        list_query = (
            base_query
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
            .order_by(OrderResponse.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        list_result = await self.db.execute(list_query)
        items = list(list_result.scalars().unique().all())

        grouped = await self.db.execute(
            select(OrderResponse.status, func.count(OrderResponse.id))
            .join(Order, Order.id == OrderResponse.order_id)
            .where(Order.customer_id == customer_id)
            .group_by(OrderResponse.status)
        )

        counters_map = {status: count for status, count in grouped.all()}
        counters = ResponseCounters(
            new=counters_map.get(ResponseStatus.NEW, 0) + counters_map.get(ResponseStatus.REVIEW, 0),
            review=counters_map.get(ResponseStatus.NEW, 0) + counters_map.get(ResponseStatus.REVIEW, 0),
            rejected=counters_map.get(ResponseStatus.REJECTED, 0),
            accepted=counters_map.get(ResponseStatus.ACCEPTED, 0) + counters_map.get(ResponseStatus.IN_PROGRESS, 0),
            completed=counters_map.get(ResponseStatus.COMPLETED, 0),
            archive=counters_map.get(ResponseStatus.ARCHIVED, 0),
        )

        return items, total, counters
