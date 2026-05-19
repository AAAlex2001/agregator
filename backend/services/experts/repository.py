from dataclasses import dataclass
from datetime import datetime

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order, OrderStatus
from models.response import OrderResponse as OrderResponseModel, ResponseStatus
from models.user import User, UserRole
from utils.pagination import paginate_with_has_more


@dataclass(frozen=True)
class ExpertSummaryRow:
    "Денормализованные данные эксперта для карточки. Никаких контактов."

    public_id: str
    full_name: str
    avatar_url: str | None
    rating: float | None
    review_count: int
    completed_orders_count: int
    joined_at: datetime


@dataclass(frozen=True)
class ExpertOrderHistoryItem:
    "Один заказ из истории эксперта вместе с принятым откликом по нему."

    order: Order
    accepted_response: OrderResponseModel | None


class ExpertsRepository:
    "Все обращения к БД по сущности эксперт. Никакой бизнес-логики, только запросы."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_summaries(
        self,
        skip: int,
        limit: int,
        query: str | None,
    ) -> tuple[list[ExpertSummaryRow], bool]:
        "Постраничная выдача карточек экспертов. Сортировка: rating desc, review_count desc, дата регистрации desc."
        completed_orders_subq = (
            select(func.count(Order.id))
            .where(
                Order.assigned_expert_id == User.id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .correlate(User)
            .scalar_subquery()
        )

        base_query: Select = (
            select(User, completed_orders_subq.label("completed_orders_count"))
            .where(
                User.role == UserRole.EXPERT,
                User.is_active.is_(True),
            )
            .order_by(
                User.rating.desc().nullslast(),
                User.review_count.desc(),
                User.created_at.desc(),
            )
        )

        if query and query.strip():
            pattern = f"%{query.strip()}%"
            base_query = base_query.where(
                User.first_name.ilike(pattern) | User.last_name.ilike(pattern)
            )

        rows = (
            await self.db.execute(base_query.offset(skip).limit(limit + 1))
        ).all()
        has_more = len(rows) > limit
        rows = rows[:limit]

        summaries: list[ExpertSummaryRow] = []
        for user, completed_orders_count in rows:
            summaries.append(self.build_summary_row(user, completed_orders_count))
        return summaries, has_more

    async def get_summary(self, public_id: str) -> ExpertSummaryRow | None:
        "Карточка одного эксперта по public_id. None, если эксперта нет или он не EXPERT."
        completed_orders_subq = (
            select(func.count(Order.id))
            .where(
                Order.assigned_expert_id == User.id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .correlate(User)
            .scalar_subquery()
        )

        row = (
            await self.db.execute(
                select(User, completed_orders_subq.label("completed_orders_count")).where(
                    User.public_id == public_id,
                    User.role == UserRole.EXPERT,
                )
            )
        ).one_or_none()

        if row is None:
            return None
        user, completed_orders_count = row
        return self.build_summary_row(user, completed_orders_count)

    async def get_expert_id_by_public_id(self, public_id: str) -> int | None:
        "Локальный id эксперта по public_id. None, если не найден."
        return (
            await self.db.execute(
                select(User.id).where(
                    User.public_id == public_id,
                    User.role == UserRole.EXPERT,
                )
            )
        ).scalar_one_or_none()

    async def list_orders_history(
        self,
        expert_id: int,
        skip: int,
        limit: int,
    ) -> tuple[list[ExpertOrderHistoryItem], bool]:
        "Архивные заказы, где эксперт был назначенным исполнителем. С принятым откликом."
        list_query: Select = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(
                Order.assigned_expert_id == expert_id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .order_by(Order.updated_at.desc())
        )

        orders, has_more = await paginate_with_has_more(self.db, list_query, skip, limit)
        items = [
            ExpertOrderHistoryItem(
                order=order,
                accepted_response=self.find_accepted_response(order, expert_id),
            )
            for order in orders
        ]
        return items, has_more

    def build_summary_row(self, user: User, completed_orders_count: int | None) -> ExpertSummaryRow:
        first = user.first_name or ""
        last = user.last_name or ""
        full_name = " ".join(part for part in (first, last) if part).strip() or "Эксперт"
        return ExpertSummaryRow(
            public_id=user.public_id,
            full_name=full_name,
            avatar_url=user.avatar_url,
            rating=float(user.rating) if user.rating is not None else None,
            review_count=int(user.review_count or 0),
            completed_orders_count=int(completed_orders_count or 0),
            joined_at=user.created_at,
        )

    def find_accepted_response(
        self,
        order: Order,
        expert_id: int,
    ) -> OrderResponseModel | None:
        "Отклик принятого эксперта по архивному заказу (статус IN_PROGRESS либо COMPLETED)."
        for response in order.responses:
            if response.expert_id != expert_id:
                continue
            if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                continue
            return response
        return None
