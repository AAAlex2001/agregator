"""DTO дашборда, заказов и учётных записей для admin-next."""

from datetime import date, datetime

from pydantic import BaseModel, Field


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


class AdminCompanyOut(BaseModel):
    "Карточка компании из DaData по ИНН учётной записи."

    name: str
    inn: str | None
    kpp: str | None
    ogrn: str | None
    status: str | None
    registration_date: date | None
    manager: str | None
    address: str | None
    okved: str | None


class AdminAccountDetailOut(BaseModel):
    "Профиль учётной записи в админке."

    id: int
    role: str
    first_name: str | None
    last_name: str | None
    email: str | None
    email_verified: bool
    phone: str | None
    inn: str | None
    company: AdminCompanyOut | None
    is_active: bool
    has_telegram: bool
    orders_count: int
    responses_count: int
    subscription_name: str | None
    subscription_expires_at: datetime | None
    created_at: datetime
    updated_at: datetime


class AdminAccountUpdate(BaseModel):
    "Правка профиля учётной записи из админки."

    first_name: str | None = Field(None, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    email: str | None = Field(None, max_length=255)
    email_verified: bool
    phone: str | None = Field(None, max_length=50)
    inn: str | None = Field(None, max_length=12)
    is_active: bool


class AdminAccountListOut(BaseModel):
    "Страница учётных записей."

    items: list[AdminAccountOut]
    total: int
