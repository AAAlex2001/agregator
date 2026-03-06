from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, BigInteger, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from models.base import Base


class PaymentStatus(str, PyEnum):
    PENDING = "PENDING"
    WAITING_FOR_CAPTURE = "WAITING_FOR_CAPTURE"
    SUCCEEDED = "SUCCEEDED"
    CANCELED = "CANCELED"
    REFUNDED = "REFUNDED"

    def __str__(self):
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
    COMMISSION = "COMMISSION"

    def __str__(self):
        labels = {"DEPOSIT": "Пополнение", "WITHDRAWAL": "Вывод", "COMMISSION": "Комиссия"}
        return labels.get(self.value, self.value)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    yookassa_id = Column(String(100), unique=True, nullable=True, index=True)
    amount = Column(BigInteger, nullable=False)
    payment_type = Column(Enum(PaymentType), nullable=False)
    status = Column(Enum(PaymentStatus, name="paymentstatus"), nullable=False, index=True, default=PaymentStatus.PENDING)
    description = Column(String(500), nullable=False, default="")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="payments")

    def __str__(self):
        return f"Платёж #{self.id} {self.amount / 100:.2f} ₽ [{str(self.status)}]"
