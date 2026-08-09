"""DTO заявки с лендинга: заказчик регистрируется и сразу публикует заявку."""
from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator

from models.order import OrderWorkType


class GuestOrderCustomer(BaseModel):
    "Данные заказчика из формы лендинга — из них создаётся аккаунт без пароля."
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    email: EmailStr


class GuestOrderRequest(BaseModel):
    "Заявка с лендинга: заказчик + параметры заказа + поля направления."
    customer: GuestOrderCustomer
    work_type: OrderWorkType
    title: str = Field(..., min_length=1, max_length=500)
    comment: str = Field("", max_length=5000)
    sum_amount: int = Field(..., ge=0)
    start_date: date | None = None
    deadline: date
    responses_deadline: datetime | None = None
    details: dict[str, Any] | None = None

    @field_validator("sum_amount")
    @classmethod
    def validate_sum_amount(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Укажите начальную максимальную цену")
        return value


class GuestOrderResponse(BaseModel):
    "Результат: заявка опубликована, выдана сессия, на почту ушёл код подтверждения."
    order_public_id: str
    email: EmailStr
    role: str
