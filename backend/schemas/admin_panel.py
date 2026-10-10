"""DTO дашборда, заказов и учётных записей для admin-next."""

from datetime import date, datetime

from pydantic import BaseModel


class DashboardCounterOut(BaseModel):
    "Сколько записей всего и сколько создано за 7 и 30 дней."

    total: int
    week: int
    month: int


class DailyCountOut(BaseModel):
    "Сколько записей создано за день."

    date: date
    count: int


class DashboardOut(BaseModel):
    "Сводка платформы: счётчики, динамика за 30 дней и распределения по ролям и статусам."

    users: DashboardCounterOut
    orders: DashboardCounterOut
    responses: DashboardCounterOut
    users_daily: list[DailyCountOut]
    orders_daily: list[DailyCountOut]
    responses_daily: list[DailyCountOut]
    users_by_role: dict[str, int]
    orders_by_status: dict[str, int]
    responses_by_status: dict[str, int]


class AdminOrderOut(BaseModel):
    "Заказ в списке админки."

    id: int
    title: str
    company: str
    work_type: str
    status: str
    sum_rub: int
    deadline: date
    customer_name: str
    expert_name: str | None
    created_at: datetime


class AdminOrderListOut(BaseModel):
    "Страница заказов."

    items: list[AdminOrderOut]
    total: int


class AdminAccountOut(BaseModel):
    "Учётная запись в списке админки."

    id: int
    role: str
    name: str
    company_name: str | None
    email: str | None
    phone: str | None
    inn: str | None
    is_active: bool
    created_at: datetime


class AdminAccountListOut(BaseModel):
    "Страница учётных записей."

    items: list[AdminAccountOut]
    total: int
