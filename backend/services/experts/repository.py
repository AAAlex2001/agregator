"Repository: доступ к БД для experts."
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy import ColumnElement, Float, Select, cast, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, selectinload

from models.order import Order, OrderStatus
from models.response import OrderResponse as OrderResponseModel
from models.response import ResponseStatus
from models.user import User, UserRole
from utils.pagination import paginate_with_has_more

SORT_BY_RATING = "rating"
SORT_BY_COMPLETED_ORDERS = "completed_orders"
SORT_BY_REVIEW_COUNT = "review_count"
SORT_DIR_DESC = "desc"
SORT_DIR_ASC = "asc"

RATING_PRIOR_WEIGHT = 5.0
RATING_PRIOR_MEAN = 4.5


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
    last_order: Order | None
    last_order_response: OrderResponseModel | None


@dataclass(frozen=True)
class ExpertOrderHistoryItem:
    "Один заказ из истории эксперта вместе с принятым откликом по нему."

    order: Order
    accepted_response: OrderResponseModel | None


@dataclass(frozen=True)
class ExpertLocationRow:
    "Эксперт с координатами базирования — точка на карте."

    public_id: str
    full_name: str
    avatar_url: str | None
    rating: float | None
    city: str | None
    lat: float
    lng: float
    travels_to_other_regions: bool


class ExpertsRepository:
    "Все обращения к БД по сущности эксперт. Никакой бизнес-логики, только запросы."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_summaries(
        self,
        skip: int,
        limit: int,
        query: str | None,
        sort_by: str = SORT_BY_RATING,
        sort_dir: str = SORT_DIR_DESC,
    ) -> tuple[list[ExpertSummaryRow], bool]:
        "Карточки экспертов с агрегатами. Только эксперты с отзывами (review_count > 0)."
        completed_orders_expr = (
            select(func.count(Order.id))
            .where(
                Order.assigned_expert_id == User.id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .correlate(User)
            .scalar_subquery()
            .label("completed_orders_count")
        )

        base_query: Select[tuple[User, int]] = (
            select(User, completed_orders_expr)
            .where(
                User.role == UserRole.EXPERT,
                User.is_active.is_(True),
                User.review_count > 0,
            )
        )

        if query and query.strip():
            pattern = f"%{query.strip()}%"
            base_query = base_query.where(
                User.first_name.ilike(pattern) | User.last_name.ilike(pattern)
            )

        sort_column = self.resolve_sort_column(sort_by, completed_orders_expr)
        is_desc = sort_dir != SORT_DIR_ASC
        primary = sort_column.desc().nullslast() if is_desc else sort_column.asc().nullsfirst()
        review_secondary = (
            User.review_count.desc() if is_desc else User.review_count.asc()
        )
        base_query = base_query.order_by(primary, review_secondary, User.created_at.desc())

        rows = (await self.db.execute(base_query.offset(skip).limit(limit + 1))).all()
        has_more = len(rows) > limit
        rows = rows[:limit]

        expert_ids = [user.id for user, _ in rows]
        last_orders_by_expert = await self.fetch_last_orders(expert_ids)

        summaries: list[ExpertSummaryRow] = []
        for user, completed_orders_count in rows:
            last_order = last_orders_by_expert.get(user.id)
            last_response = (
                self.find_accepted_response(last_order, user.id) if last_order is not None else None
            )
            summaries.append(
                self.build_summary_row(user, completed_orders_count, last_order, last_response)
            )
        return summaries, has_more

    async def get_summary(self, public_id: str) -> ExpertSummaryRow | None:
        "Возвращает запрошенную сущность."
        completed_orders_expr = (
            select(func.count(Order.id))
            .where(
                Order.assigned_expert_id == User.id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .correlate(User)
            .scalar_subquery()
            .label("completed_orders_count")
        )

        row = (
            await self.db.execute(
                select(User, completed_orders_expr).where(
                    User.public_id == public_id,
                    User.role == UserRole.EXPERT,
                )
            )
        ).one_or_none()

        if row is None:
            return None
        user, completed_orders_count = row
        last_orders_by_expert = await self.fetch_last_orders([user.id])
        last_order = last_orders_by_expert.get(user.id)
        last_response = (
            self.find_accepted_response(last_order, user.id) if last_order is not None else None
        )
        return self.build_summary_row(user, completed_orders_count, last_order, last_response)

    async def list_with_location(self, limit: int = 1000) -> list[ExpertLocationRow]:
        "Активные эксперты с заданными координатами базирования — для карты."
        query: Select[tuple[User]] = (
            select(User)
            .where(
                User.role == UserRole.EXPERT,
                User.is_active.is_(True),
                User.location_lat.is_not(None),
                User.location_lng.is_not(None),
            )
            .order_by(User.created_at.desc())
            .limit(limit)
        )
        users = (await self.db.execute(query)).scalars().all()
        return [self.build_location_row(user) for user in users]

    def build_location_row(self, user: User) -> ExpertLocationRow:
        "Строит точку карты из эксперта."
        first = user.first_name or ""
        last = user.last_name or ""
        full_name = " ".join(part for part in (first, last) if part).strip() or "Эксперт"
        return ExpertLocationRow(
            public_id=user.public_id,
            full_name=full_name,
            avatar_url=user.avatar_url,
            rating=float(user.rating) if user.rating is not None else None,
            city=user.location_city,
            lat=float(user.location_lat),
            lng=float(user.location_lng),
            travels_to_other_regions=bool(user.travels_to_other_regions),
        )

    async def get_expert_id_by_public_id(self, public_id: str) -> int | None:
        "Возвращает запрошенную сущность."
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
        "Возвращает список сущностей с пагинацией/фильтрами."
        list_query: Select[tuple[Order]] = (
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

    async def fetch_last_orders(self, expert_ids: list[int]) -> dict[int, Order]:
        "Для каждого эксперта вернуть его последний ARCHIVED заказ. Один запрос на всех."
        if not expert_ids:
            return {}
        query: Select[tuple[Order]] = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(
                Order.assigned_expert_id.in_(expert_ids),
                Order.status == OrderStatus.ARCHIVED,
            )
            .distinct(Order.assigned_expert_id)
            .order_by(Order.assigned_expert_id, Order.updated_at.desc())
        )
        orders = list((await self.db.execute(query)).scalars().all())
        return {
            order.assigned_expert_id: order
            for order in orders
            if order.assigned_expert_id is not None
        }

    def resolve_sort_column(
        self, sort_by: str, completed_orders_expr: ColumnElement[Any]
    ) -> InstrumentedAttribute[Any] | ColumnElement[Any]:
        "Возвращает SQL-выражение для сортировки экспертов по заданному критерию."
        if sort_by == SORT_BY_COMPLETED_ORDERS:
            return completed_orders_expr
        if sort_by == SORT_BY_REVIEW_COUNT:
            return User.review_count
        rating_f = func.coalesce(cast(User.rating, Float), cast(0.0, Float))
        prior = cast(RATING_PRIOR_WEIGHT * RATING_PRIOR_MEAN, Float)
        weight = cast(RATING_PRIOR_WEIGHT, Float)
        return (User.review_count * rating_f + prior) / (User.review_count + weight)

    def build_summary_row(
        self,
        user: User,
        completed_orders_count: int | None,
        last_order: Order | None,
        last_response: OrderResponseModel | None,
    ) -> ExpertSummaryRow:
        "Строит объект из входных данных."
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
            last_order=last_order,
            last_order_response=last_response,
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
