"Repository: выборки для дашборда, списка заказов и списка учётных записей админки."

from datetime import date, datetime

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.account import Account, UserRole
from models.order import Order, OrderStatus, OrderWorkType
from models.response import OrderResponse

TrackedModel = type[Account] | type[Order] | type[OrderResponse]


class AdminPanelRepository:
    "Все обращения к БД для дашборда, заказов и учётных записей админки."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def count_created(self, model: TrackedModel, since: datetime | None = None) -> int:
        "Сколько записей создано с момента since, без него — всего."
        query = select(func.count()).select_from(model)
        if since is not None:
            query = query.where(model.created_at >= since)
        return await self.db.scalar(query) or 0

    async def count_created_by_day(self, model: TrackedModel, since: datetime) -> dict[date, int]:
        "Сколько записей создано по дням начиная с since. Дни без записей в ответ не попадают."
        day = func.date(model.created_at)
        rows = await self.db.execute(select(day, func.count()).where(model.created_at >= since).group_by(day))
        return dict(rows.tuples().all())

    async def count_accounts_by_role(self) -> dict[str, int]:
        "Количество учётных записей по ролям."
        rows = await self.db.execute(select(Account.role, func.count()).group_by(Account.role))
        return {role.value: count for role, count in rows.tuples()}

    async def count_orders_by_status(self) -> dict[str, int]:
        "Количество заказов по статусам."
        rows = await self.db.execute(select(Order.status, func.count()).group_by(Order.status))
        return {status.value: count for status, count in rows.tuples()}

    async def count_responses_by_status(self) -> dict[str, int]:
        "Количество откликов по статусам."
        rows = await self.db.execute(
            select(OrderResponse.status, func.count()).group_by(OrderResponse.status)
        )
        return {status.value: count for status, count in rows.tuples()}

    async def list_orders(
        self,
        status: OrderStatus | None,
        work_type: OrderWorkType | None,
        query: str | None,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], int]:
        "Заказы новыми сверху с заказчиком и исполнителем и общее количество под фильтры."
        statement = select(Order)
        if status is not None:
            statement = statement.where(Order.status == status)
        if work_type is not None:
            statement = statement.where(Order.work_type == work_type)
        if query:
            pattern = f"%{query.strip()}%"
            statement = statement.where(or_(Order.title.ilike(pattern), Order.company.ilike(pattern)))

        total = await self.db.scalar(select(func.count()).select_from(statement.subquery())) or 0
        rows = await self.db.execute(
            statement.options(selectinload(Order.customer), selectinload(Order.assigned_expert))
            .order_by(Order.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(rows.scalars().all()), total

    async def list_accounts(
        self,
        role: UserRole | None,
        query: str | None,
        skip: int,
        limit: int,
    ) -> tuple[list[Account], int]:
        "Учётные записи новыми сверху и общее количество под фильтр по роли и поиск."
        statement = select(Account)
        if role is not None:
            statement = statement.where(Account.role == role)
        if query:
            pattern = f"%{query.strip()}%"
            statement = statement.where(
                or_(
                    Account.first_name.ilike(pattern),
                    Account.last_name.ilike(pattern),
                    Account.email.ilike(pattern),
                    Account.phone.ilike(pattern),
                    Account.inn.ilike(pattern),
                )
            )

        total = await self.db.scalar(select(func.count()).select_from(statement.subquery())) or 0
        rows = await self.db.execute(statement.order_by(Account.id.desc()).offset(skip).limit(limit))
        return list(rows.scalars().all()), total
