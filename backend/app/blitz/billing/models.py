"""Счёт организации на этап оплаты: аванс или остаток.

Реквизиты плательщика копируются в счёт: выставленный документ не меняется.
Оплату подтверждает администратор, когда видит поступление в банке.
Счёт аннулируется, если цену заявки изменили до оплаты.
"""

from datetime import datetime
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base
from app.core.clock import now


class PaymentStage(StrEnum):
    """Этап оплаты."""

    ADVANCE = "advance"
    FINAL = "final"


class Invoice(Base):
    """Счёт на оплату этапа."""

    __tablename__ = "blitz_invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    stage: Mapped[str] = mapped_column(String(8))
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    payer_name: Mapped[str] = mapped_column(String(255))
    payer_inn: Mapped[str] = mapped_column(String(12))
    payer_kpp: Mapped[str | None] = mapped_column(String(9))
    payer_address: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    reported_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    canceled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    @property
    def number(self) -> str:
        """Номер счёта: год и порядковый номер."""

        return f"{self.created_at.year}-{self.id:04d}"

    @property
    def is_open(self) -> bool:
        """Счёт ждёт оплаты: не оплачен и не аннулирован."""

        return self.paid_at is None and self.canceled_at is None
