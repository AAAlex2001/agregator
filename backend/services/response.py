from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole
from schemas.response import ResponseCreate, ResponseCounters, ResponseTab


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
            status=ResponseStatus.REVIEW,
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

    async def get_response_by_id(self, response_id: int) -> OrderResponse:
        result = await self.db.execute(
            select(OrderResponse)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
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

    @staticmethod
    def status_for_tab(tab: ResponseTab | None) -> ResponseStatus | None:
        if tab is None or tab == ResponseTab.ALL:
            return None
        if tab == ResponseTab.REVIEW:
            return ResponseStatus.REVIEW
        if tab == ResponseTab.REJECTED:
            return ResponseStatus.REJECTED
        if tab == ResponseTab.ACCEPTED:
            return ResponseStatus.ACCEPTED
        if tab == ResponseTab.COMPLETED:
            return ResponseStatus.COMPLETED
        if tab == ResponseTab.ARCHIVE:
            return ResponseStatus.ARCHIVED
        return None

    async def list_responses(
        self,
        expert_id: int,
        tab: ResponseTab | None,
        skip: int,
        limit: int,
    ) -> tuple[list[OrderResponse], int, ResponseCounters]:
        await self.ensure_expert(expert_id)

        status_filter = self.status_for_tab(tab)

        base_query = select(OrderResponse).where(OrderResponse.expert_id == expert_id)
        if status_filter:
            base_query = base_query.where(OrderResponse.status == status_filter)

        total_query = select(func.count(OrderResponse.id)).where(
            OrderResponse.expert_id == expert_id
        )
        if status_filter:
            total_query = total_query.where(OrderResponse.status == status_filter)

        total_result = await self.db.execute(total_query)
        total = total_result.scalar_one()

        list_query = (
            base_query
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
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
            all=sum(counters_map.values()),
            review=counters_map.get(ResponseStatus.REVIEW, 0),
            rejected=counters_map.get(ResponseStatus.REJECTED, 0),
            accepted=counters_map.get(ResponseStatus.ACCEPTED, 0),
            completed=counters_map.get(ResponseStatus.COMPLETED, 0),
            archive=counters_map.get(ResponseStatus.ARCHIVED, 0),
        )

        return items, total, counters
