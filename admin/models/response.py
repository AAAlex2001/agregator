from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.order import Order
    from models.review import Review
    from models.user import User


class ResponseStatus(str, PyEnum):
    REVIEW = "REVIEW"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    WITHDRAWN_BY_EXPERT = "WITHDRAWN_BY_EXPERT"

    def __str__(self) -> str:
        labels = {
            "REVIEW": "На рассмотрении",
            "REJECTED": "Отклонён",
            "ACCEPTED": "Принят",
            "IN_PROGRESS": "В работе",
            "COMPLETED": "Завершён",
            "WITHDRAWN_BY_EXPERT": "Отозван экспертом",
        }
        return labels.get(self.value, self.value)


class OrderResponse(Base):
    "Отклик эксперта на заказ."
    __tablename__ = "order_responses"
    __table_args__ = (
        UniqueConstraint("order_id", "expert_id", name="uq_order_responses_order_expert"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    proposed_sum_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    proposed_deadline: Mapped[date] = mapped_column(Date, nullable=False)
    technical_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    expert_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    status: Mapped[ResponseStatus] = mapped_column(Enum(ResponseStatus, name="responsestatus"), nullable=False, index=True, default=ResponseStatus.REVIEW)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="responses")
    expert: Mapped["User"] = relationship(back_populates="responses")
    reviews: Mapped[list["Review"]] = relationship(back_populates="response")

    def __str__(self) -> str:
        return f"Отклик #{self.id} [{str(self.status)}]"
