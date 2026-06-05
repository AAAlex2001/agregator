from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.response import OrderResponse
    from models.user import User


class Review(Base):
    """Отзыв заказчика об эксперте по выполненному отклику."""
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("response_id", "customer_id", name="uq_reviews_response_customer"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    response_id: Mapped[int] = mapped_column(ForeignKey("order_responses.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    customer: Mapped["User"] = relationship(foreign_keys=[customer_id], back_populates="customer_reviews")
    expert: Mapped["User"] = relationship(foreign_keys=[expert_id], back_populates="expert_reviews")
    response: Mapped["OrderResponse"] = relationship(back_populates="reviews")
