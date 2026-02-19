from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CreatePaymentRequest(BaseModel):
    """Запрос на создание платежа (пополнение баланса)."""
    amount: int  # копейки
    return_url: str


class CreatePaymentResponse(BaseModel):
    """Ответ с URL для оплаты."""
    payment_id: int
    confirmation_url: str


class PaymentItem(BaseModel):
    """Элемент списка платежей."""
    id: int
    yookassa_id: Optional[str] = None
    amount: int
    payment_type: str
    status: str
    description: str
    created_at: datetime


class PaymentListResponse(BaseModel):
    """Список платежей пользователя."""
    items: list[PaymentItem]


class BalanceResponse(BaseModel):
    """Баланс пользователя."""
    balance: int


class RefundRequest(BaseModel):
    """Запрос на возврат."""
    payment_id: int
