from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.contact_deal import ContactAccessDeal
    from models.response import OrderResponse


class Review(Base):
    """Отзыв заказчика об эксперте по выполненному отклику."""
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("response_id", "customer_id", name="uq_reviews_response_customer"),
        UniqueConstraint(
            "contact_deal_id",
            "customer_id",
            name="uq_reviews_contact_deal_customer",
        ),
        CheckConstraint(
            (
                "(response_id IS NOT NULL AND order_id IS NOT NULL "
                "AND contact_deal_id IS NULL) OR "
                "(response_id IS NULL AND order_id IS NULL "
                "AND contact_deal_id IS NOT NULL)"
            ),
            name="ck_reviews_single_source",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int | None] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=True, index=True
    )
    response_id: Mapped[int | None] = mapped_column(
        ForeignKey("order_responses.id", ondelete="CASCADE"), nullable=True, index=True
    )
    contact_deal_id: Mapped[int | None] = mapped_column(
        ForeignKey("contact_access_deals.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    customer_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    customer: Mapped["Account"] = relationship(foreign_keys=[customer_id], back_populates="customer_reviews")
    expert: Mapped["Account"] = relationship(foreign_keys=[expert_id], back_populates="expert_reviews")
    response: Mapped["OrderResponse | None"] = relationship(back_populates="reviews")
    contact_deal: Mapped["ContactAccessDeal | None"] = relationship(
        back_populates="reviews"
    )
