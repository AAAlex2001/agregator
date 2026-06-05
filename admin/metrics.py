"Агрегаты из БД для дашборда: счётчики и timeseries по регистрациям, заказам, откликам. Sync — потому что админка sync."

from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from typing import Literal

from sqlalchemy import Column, func, select
from sqlalchemy.orm import Session as DbSession

from models import Order, OrderResponse, User

Period = Literal["day", "week", "month"]
PERIOD_DAYS: dict[Period, int] = {"day": 1, "week": 7, "month": 30}


@dataclass(frozen=True)
class CounterCard:
    "Карточка-каунтер: сколько событий за сутки/неделю/месяц."
    day: int
    week: int
    month: int


@dataclass(frozen=True)
class TimeSeriesPoint:
    "Одна точка временного ряда — дата + количество событий за этот день."
    bucket: date
    count: int


@dataclass(frozen=True)
class RoleBreakdown:
    "Срез пользователей по роли (CUSTOMER/EXPERT/LICENSE_HOLDER)."
    role: str
    count: int


@dataclass(frozen=True)
class StatusBreakdown:
    "Срез заказов/откликов по статусу."
    status: str
    count: int


@dataclass(frozen=True)
class DashboardMetrics:
    "Полный набор данных для рендера дашборда — карточки + графики + пироги."
    users: CounterCard
    orders: CounterCard
    responses: CounterCard
    users_timeseries: list[TimeSeriesPoint]
    orders_timeseries: list[TimeSeriesPoint]
    responses_timeseries: list[TimeSeriesPoint]
    users_by_role: list[RoleBreakdown]
    orders_by_status: list[StatusBreakdown]
    responses_by_status: list[StatusBreakdown]


def counter_for_column(db: DbSession, created_at_column: Column[datetime]) -> CounterCard:
    "Считает counts за последние сутки / 7 / 30 дней по datetime-колонке. Используется для регистраций, заказов, откликов."
    now = datetime.now(UTC)
    values: dict[Period, int] = {}
    for key, days in PERIOD_DAYS.items():
        since = now - timedelta(days=days)
        stmt = select(func.count()).where(created_at_column >= since)
        values[key] = int(db.execute(stmt).scalar_one() or 0)
    return CounterCard(day=values["day"], week=values["week"], month=values["month"])


def timeseries_for_column(db: DbSession, created_at_column: Column[datetime], days: int) -> list[TimeSeriesPoint]:
    "Группирует события по дням за последние N дней. Пустые дни заполняет нулями, чтобы график был непрерывным."
    since = datetime.now(UTC) - timedelta(days=days)
    day_expr = func.date_trunc("day", created_at_column).label("bucket")
    stmt = (
        select(day_expr, func.count().label("cnt"))
        .where(created_at_column >= since)
        .group_by(day_expr)
        .order_by(day_expr)
    )
    rows = db.execute(stmt).all()
    by_date: dict[date, int] = {row.bucket.date(): int(row.cnt) for row in rows}
    today = datetime.now(UTC).date()
    return [
        TimeSeriesPoint(bucket=today - timedelta(days=offset), count=by_date.get(today - timedelta(days=offset), 0))
        for offset in range(days - 1, -1, -1)
    ]


def users_by_role(db: DbSession) -> list[RoleBreakdown]:
    "Распределение пользователей по ролям. Один SELECT с GROUP BY."
    stmt = select(User.role, func.count()).group_by(User.role)
    rows = db.execute(stmt).all()
    return [RoleBreakdown(role=enum_to_str(row[0]), count=int(row[1])) for row in rows]


def orders_by_status(db: DbSession) -> list[StatusBreakdown]:
    "Распределение заказов по статусу (ACTIVE/ARCHIVED)."
    stmt = select(Order.status, func.count()).group_by(Order.status)
    rows = db.execute(stmt).all()
    return [StatusBreakdown(status=enum_to_str(row[0]), count=int(row[1])) for row in rows]


def responses_by_status(db: DbSession) -> list[StatusBreakdown]:
    "Распределение откликов по статусу (REVIEW/REJECTED/ACCEPTED/IN_PROGRESS/COMPLETED/WITHDRAWN_BY_EXPERT)."
    stmt = select(OrderResponse.status, func.count()).group_by(OrderResponse.status)
    rows = db.execute(stmt).all()
    return [StatusBreakdown(status=enum_to_str(row[0]), count=int(row[1])) for row in rows]


def collect_dashboard(db: DbSession, timeseries_days: int = 30) -> DashboardMetrics:
    "Собирает весь срез метрик одним вызовом — каунтеры за 3 окна + графики за месяц + пироги по ролям/статусам."
    return DashboardMetrics(
        users=counter_for_column(db, User.created_at),
        orders=counter_for_column(db, Order.created_at),
        responses=counter_for_column(db, OrderResponse.created_at),
        users_timeseries=timeseries_for_column(db, User.created_at, timeseries_days),
        orders_timeseries=timeseries_for_column(db, Order.created_at, timeseries_days),
        responses_timeseries=timeseries_for_column(db, OrderResponse.created_at, timeseries_days),
        users_by_role=users_by_role(db),
        orders_by_status=orders_by_status(db),
        responses_by_status=responses_by_status(db),
    )


def enum_to_str(value: object) -> str:
    "Возвращает читаемую русскую подпись для enum (использует переопределённый __str__ модели), либо raw-строку если SQLAlchemy вернула строку."
    return str(value)
