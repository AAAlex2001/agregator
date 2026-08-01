from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account


class PaymentStatus(str, PyEnum):
    PENDING = "PENDING"
    WAITING_FOR_CAPTURE = "WAITING_FOR_CAPTURE"
    SUCCEEDED = "SUCCEEDED"
    CANCELED = "CANCELED"
    REFUNDED = "REFUNDED"

    def __str__(self) -> str:
        labels = {
            "PENDING": "Ожидает",
            "WAITING_FOR_CAPTURE": "Ожидает подтверждения",
            "SUCCEEDED": "Успешен",
            "CANCELED": "Отменён",
            "REFUNDED": "Возврат",
        }
        return labels.get(self.value, self.value)


class PaymentType(str, PyEnum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"

    def __str__(self) -> str:
        labels = {"DEPOSIT": "Пополнение", "WITHDRAWAL": "Вывод"}
        return labels.get(self.value, self.value)


class Payment(Base):
    "Платёж пользователя."
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    yookassa_id: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True, index=True)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    payment_type: Mapped[PaymentType] = mapped_column(Enum(PaymentType), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus, name="paymentstatus"), nullable=False, index=True, default=PaymentStatus.PENDING)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    account: Mapped["Account"] = relationship(back_populates="payments")

    def __str__(self) -> str:
        return f"Платёж #{self.id} {self.amount / 100:.2f} ₽ [{str(self.status)}]"
