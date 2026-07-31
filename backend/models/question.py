from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.order import Order


class OrderQuestion(Base):
    """Вопрос эксперта по заказу."""
    __tablename__ = "order_questions"
    __table_args__ = (
        UniqueConstraint("order_id", "expert_id", name="uq_order_questions_order_expert"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    asked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")

    order: Mapped["Order"] = relationship(back_populates="questions")
    expert: Mapped["Account"] = relationship()
