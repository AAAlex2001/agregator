from typing import Optional

from sqlalchemy import delete, func, not_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order, OrderBadge, OrderStatus
from models.response import OrderResponse as OrderResponseModel
from models.user import User, UserRole


class OrderRepository:
    "Все обращения к БД по сущности Order. Никакой бизнес-логики — только данные."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, order_id: int) -> Order | None:
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.id == order_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_public_id(self, public_id: str) -> Order | None:
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.public_id == public_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_for_user(
        self,
        skip: int,
        limit: int,
        status_filter: Optional[OrderStatus],
        user_id: Optional[int],
    ) -> tuple[list[Order], int]:
        count_query = select(func.count(Order.id))
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .order_by(Order.created_at.desc())
        )

        role = await self.get_user_role(user_id) if user_id is not None else None

        if role == UserRole.EXPERT:
            responded = (
                select(OrderResponseModel.id)
                .where(
                    OrderResponseModel.order_id == Order.id,
                    OrderResponseModel.expert_id == user_id,
                )
                .exists()
            )
            expert_filter = [
                Order.status == OrderStatus.ACTIVE,
                Order.assigned_expert_id.is_(None),
                not_(responded),
            ]
            count_query = count_query.where(*expert_filter)
            list_query = list_query.where(*expert_filter)
        elif role == UserRole.CUSTOMER:
            customer_filter = [
                Order.customer_id == user_id,
                Order.status != OrderStatus.ARCHIVED,
            ]
            count_query = count_query.where(*customer_filter)
            list_query = list_query.where(*customer_filter)
        elif user_id is None:
            # Гость видит все заказы платформы (ACTIVE + ARCHIVED) для публичного просмотра.
            pass
        else:
            # Любая другая авторизованная роль (например LICENSE_HOLDER) к списку заказов не допускается.
            return [], 0

        if status_filter is not None:
            count_query = count_query.where(Order.status == status_filter)
            list_query = list_query.where(Order.status == status_filter)

        total = (await self.db.execute(count_query)).scalar_one()
        list_query = list_query.offset(skip).limit(limit)
        rows = (await self.db.execute(list_query)).scalars().unique().all()
        return list(rows), total

    async def search_public(
        self,
        query: str,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], int]:
        "Поиск по всем заказам платформы (любой статус) для публичного отображения. Ищет по title и company (ILIKE)."
        pattern = f"%{query.strip()}%"
        where = (Order.title.ilike(pattern)) | (Order.company.ilike(pattern))

        count_query = select(func.count(Order.id)).where(where)
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(where)
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        total = (await self.db.execute(count_query)).scalar_one()
        rows = (await self.db.execute(list_query)).scalars().unique().all()
        return list(rows), total

    async def list_archived(
        self,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], int]:
        "Список архивных заказов — виден всем авторизованным. Подгружает принятого исполнителя и его отклик."
        count_query = (
            select(func.count(Order.id))
            .where(Order.status == OrderStatus.ARCHIVED)
        )
        list_query = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(Order.status == OrderStatus.ARCHIVED)
            .order_by(Order.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        total = (await self.db.execute(count_query)).scalar_one()
        rows = (await self.db.execute(list_query)).scalars().unique().all()
        return list(rows), total

    async def reviewed_response_ids(
        self, customer_id: int, response_ids: list[int]
    ) -> set[int]:
        "Какие из указанных откликов уже получили отзыв от данного customer'а."
        if not response_ids:
            return set()
        from models.review import Review
        query = (
            select(Review.response_id)
            .where(
                Review.customer_id == customer_id,
                Review.response_id.in_(response_ids),
            )
            .group_by(Review.response_id)
        )
        return set((await self.db.execute(query)).scalars().all())

    async def get_user_role(self, user_id: int) -> UserRole | None:
        query = select(User.role).where(User.id == user_id)
        return (await self.db.execute(query)).scalar_one_or_none()

    async def user_exists(self, user_id: int) -> bool:
        query = select(User.id).where(User.id == user_id)
        return (await self.db.execute(query)).scalar_one_or_none() is not None

    async def add(self, order: Order) -> None:
        self.db.add(order)

    async def add_badges(self, badges: list[OrderBadge]) -> None:
        self.db.add_all(badges)

    async def delete_badges_by_order(self, order_id: int) -> None:
        await self.db.execute(delete(OrderBadge).where(OrderBadge.order_id == order_id))

    async def delete(self, order: Order) -> None:
        await self.db.delete(order)

    async def flush(self) -> None:
        await self.db.flush()
