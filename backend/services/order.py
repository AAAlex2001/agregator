from typing import Optional
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.order import Order, OrderBadge, OrderStatus
from models.user import User
from schemas.order import OrderCreate, OrderUpdate

ALLOWED_TECHNICAL_FILE_EXTENSIONS = {
    ".pdf",
    ".jpeg",
    ".jpg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
}


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_orders(
        self,
        skip: int = 0,
        limit: int = 20,
        status_filter: Optional[OrderStatus] = None,
    ) -> tuple[list[Order], int]:
        count_query = select(func.count(Order.id))
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .order_by(Order.created_at.desc())
        )

        if status_filter:
            count_query = count_query.where(Order.status == status_filter)
            list_query = list_query.where(Order.status == status_filter)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        list_query = list_query.offset(skip).limit(limit)
        result = await self.db.execute(list_query)
        orders = result.scalars().unique().all()

        return list(orders), total

    async def get_order_by_id(self, order_id: int) -> Order:
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.id == order_id)
        )
        result = await self.db.execute(query)
        order = result.scalars().first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )
        return order

    async def create_order(self, data: OrderCreate) -> Order:
        customer_exists_query = select(User.id).where(User.id == data.customer_id)
        customer_exists_result = await self.db.execute(customer_exists_query)
        customer_id = customer_exists_result.scalar_one_or_none()

        if customer_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказчик не найден",
            )

        order = Order(
            title=data.title,
            comment=data.comment,
            customer_id=data.customer_id,
            technical_files=data.technical_files,
            sum_amount=data.sum_amount,
            deadline=data.deadline,
            status=data.status,
        )
        self.db.add(order)
        try:
            await self.db.flush()
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некорректные данные заказа",
            )

        if data.badges:
            badge_objects = [
                OrderBadge(
                    order_id=order.id,
                    text=badge.text,
                    variant=badge.variant,
                )
                for badge in data.badges
            ]
            self.db.add_all(badge_objects)

        await self.db.commit()

        return await self.get_order_by_id(order.id)

    async def upload_order_files(
        self,
        order_id: int,
        files: list[UploadFile],
    ) -> Order:
        order = await self.get_order_by_id(order_id)

        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не переданы файлы для загрузки",
            )

        upload_dir = (
            Path(__file__).resolve().parents[1]
            / "uploads"
            / "orders"
            / str(order_id)
        )
        upload_dir.mkdir(parents=True, exist_ok=True)

        saved_files = list(order.technical_files or [])

        for file in files:
            file_name = file.filename or ""
            extension = Path(file_name).suffix.lower()

            if extension not in ALLOWED_TECHNICAL_FILE_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Допустимые форматы файлов: "
                        "PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX"
                    ),
                )

            generated_name = f"{uuid4().hex}{extension}"
            file_path = upload_dir / generated_name

            file_content = await file.read()
            with open(file_path, "wb") as file_handle:
                file_handle.write(file_content)

            saved_files.append(f"/uploads/orders/{order_id}/{generated_name}")

        order.technical_files = saved_files
        await self.db.commit()
        await self.db.refresh(order)

        return await self.get_order_by_id(order_id)

    async def update_order(
        self, order_id: int, data: OrderUpdate
    ) -> Order:
        order = await self.get_order_by_id(order_id)

        update_data = data.model_dump(exclude_unset=True)
        badges_data = update_data.pop("badges", None)

        for field, value in update_data.items():
            setattr(order, field, value)

        if badges_data is not None:
            await self.db.execute(
                delete(OrderBadge).where(OrderBadge.order_id == order_id)
            )
            badge_objects = [
                OrderBadge(
                    order_id=order_id,
                    text=badge["text"],
                    variant=badge["variant"],
                )
                for badge in badges_data
            ]
            self.db.add_all(badge_objects)

        await self.db.commit()

        return await self.get_order_by_id(order_id)

    async def delete_order(self, order_id: int) -> Order:
        order = await self.get_order_by_id(order_id)
        order.status = OrderStatus.ARCHIVED
        await self.db.commit()
        await self.db.refresh(order)
        return order
