"Агрегаты для дашборда: регистрации/заказы/отклики по дням и срезы по роли/статусу."

from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from typing import Literal

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order
from models.response import OrderResponse
from models.user import User, UserRole

Period = Literal["day", "week", "month"]

PERIOD_DAYS: dict[Period, int] = {"day": 1, "week": 7, "month": 30}


@dataclass(slots=True, frozen=True)
class TimeSeriesPoint:
    "Одна точка временного ряда — дата + количество."

    bucket: date
    count: int


@dataclass(slots=True, frozen=True)
class RoleBreakdown:
    "Срез пользователей по роли."

    role: UserRole
    count: int


@dataclass(slots=True, frozen=True)
class StatusBreakdown:
    "Срез заказов или откликов по статусу."

    status: str
    count: int


@dataclass(slots=True, frozen=True)
class CounterCard:
    "Карточка-каунтер на дашборде: суточно/неделя/месяц."

    day: int
    week: int
    month: int


@dataclass(slots=True, frozen=True)
class DashboardMetrics:
    "Полный набор данных для рендера дашборда."

    users: CounterCard
    orders: CounterCard
    responses: CounterCard
    users_timeseries: list[TimeSeriesPoint]
    orders_timeseries: list[TimeSeriesPoint]
    responses_timeseries: list[TimeSeriesPoint]
    users_by_role: list[RoleBreakdown]
    orders_by_status: list[StatusBreakdown]
    responses_by_status: list[StatusBreakdown]


class MetricsService:
    "Все агрегатные запросы для админ-дашборда. Один сервис → одна сессия БД."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def collect(self, timeseries_days: int = 30) -> DashboardMetrics:
        "Соберает весь срез метрик для дашборда одним вызовом."
        return DashboardMetrics(
            users=await self.counter(User.created_at),
            orders=await self.counter(Order.created_at),
            responses=await self.counter(OrderResponse.created_at),
            users_timeseries=await self.timeseries(User.created_at, timeseries_days),
            orders_timeseries=await self.timeseries(Order.created_at, timeseries_days),
            responses_timeseries=await self.timeseries(OrderResponse.created_at, timeseries_days),
            users_by_role=await self.users_by_role(),
            orders_by_status=await self.orders_by_status(),
            responses_by_status=await self.responses_by_status(),
        )

    async def counter(self, created_at_column: ColumnElement[datetime]) -> CounterCard:
        "Считает counts за последние сутки / 7 дней / 30 дней по указанной datetime-колонке. Вызывается три раза — для регистраций, заказов и откликов."
        now = datetime.now(UTC)
        thresholds = {key: now - timedelta(days=days) for key, days in PERIOD_DAYS.items()}
        values: dict[Period, int] = {}
        for key, since in thresholds.items():
            stmt = select(func.count()).where(created_at_column >= since)
            values[key] = int((await self.db.execute(stmt)).scalar_one() or 0)
        return CounterCard(day=values["day"], week=values["week"], month=values["month"])

    async def timeseries(
        self, created_at_column: ColumnElement[datetime], days: int
    ) -> list[TimeSeriesPoint]:
        "Группирует по дням за последние N дней. Пустые дни заполняет нулями, чтобы график не имел дырок."
        since = datetime.now(UTC) - timedelta(days=days)
        day_expr = func.date_trunc("day", created_at_column).label("bucket")
        stmt = (
            select(day_expr, func.count().label("cnt"))
            .where(created_at_column >= since)
            .group_by(day_expr)
            .order_by(day_expr)
        )
        rows = (await self.db.execute(stmt)).all()
        by_date: dict[date, int] = {row.bucket.date(): int(row.cnt) for row in rows}

        today = datetime.now(UTC).date()
        return [
            TimeSeriesPoint(bucket=today - timedelta(days=offset), count=by_date.get(today - timedelta(days=offset), 0))
            for offset in range(days - 1, -1, -1)
        ]

    async def users_by_role(self) -> list[RoleBreakdown]:
        "Сколько пользователей в каждой роли (CUSTOMER/EXPERT/LICENSE_HOLDER)."
        stmt = select(User.role, func.count()).group_by(User.role)
        rows = (await self.db.execute(stmt)).all()
        return [RoleBreakdown(role=row[0], count=int(row[1])) for row in rows]

    async def orders_by_status(self) -> list[StatusBreakdown]:
        "Распределение заказов по статусу (ACTIVE/ARCHIVED)."
        stmt = select(Order.status, func.count()).group_by(Order.status)
        rows = (await self.db.execute(stmt)).all()
        return [StatusBreakdown(status=enum_to_str(row[0]), count=int(row[1])) for row in rows]

    async def responses_by_status(self) -> list[StatusBreakdown]:
        "Распределение откликов по статусу (REVIEW/REJECTED/ACCEPTED/IN_PROGRESS/COMPLETED/WITHDRAWN_BY_EXPERT)."
        stmt = select(OrderResponse.status, func.count()).group_by(OrderResponse.status)
        rows = (await self.db.execute(stmt)).all()
        return [StatusBreakdown(status=enum_to_str(row[0]), count=int(row[1])) for row in rows]


def enum_to_str(value: object) -> str:
    "Унифицирует представление enum в строку для labels графиков. SQLAlchemy может вернуть либо член enum (есть атрибут .value), либо raw-строку — обрабатываем оба случая."
    return value.value if hasattr(value, "value") else str(value)
