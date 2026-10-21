"""Счета, оплата картой и акты в ответах API."""

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.core.money import Money


class InvoiceSchema(BaseModel):
    """Счёт на оплату этапа."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    number: str
    stage: str
    amount: Money
    created_at: datetime
    reported_at: datetime | None
    paid_at: datetime | None
    canceled_at: datetime | None


class AdminInvoiceSchema(InvoiceSchema):
    """Счёт в админке: с номером заявки и плательщиком."""

    order_id: int
    payer_name: str
    payer_inn: str


class ProofKind(StrEnum):
    """Чем заказчик подтверждает оплату счёта."""

    PAYMENT_ORDER = "payment_order"
    GUARANTEE_LETTER = "guarantee_letter"


class PaymentLinkSchema(BaseModel):
    """Ссылка на страницу оплаты картой."""

    confirmation_url: str = Field(..., description="Куда перейти для оплаты")
