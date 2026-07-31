from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.payment import Payment


class SubscriptionKind(str, PyEnum):
    "Тип подписки эксперта."
    SINGLE = "SINGLE"
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"


class SubscriptionStatus(str, PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    USED = "USED"


class PricingPlan(Base):
    "Тариф, доступный для покупки. Каждый kind существует в единственном экземпляре."
    __tablename__ = "pricing_plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    kind: Mapped[SubscriptionKind] = mapped_column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    badge: Mapped[str | None] = mapped_column(String(50), nullable=True)
    price_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)
    period_label: Mapped[str] = mapped_column(String(50), nullable=False)
    duration_days: Mapped[int | None] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    cta_label: Mapped[str] = mapped_column(String(100), nullable=False)
    features: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    highlighted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("kind", name="uq_pricing_plans_kind"),
    )


class UserSubscription(Base):
    "Купленная пользователем подписка. Разовая — со счётчиком откликов, срочная — с expires_at."
    __tablename__ = "user_subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("pricing_plans.id", ondelete="RESTRICT"),
        nullable=False,
    )
    kind: Mapped[SubscriptionKind] = mapped_column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(
        Enum(SubscriptionStatus, name="subscriptionstatus"),
        nullable=False,
        default=SubscriptionStatus.ACTIVE,
        index=True,
    )
    activated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    responses_remaining: Mapped[int | None] = mapped_column(nullable=True)
    payment_id: Mapped[int | None] = mapped_column(
        ForeignKey("payments.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    account: Mapped["Account"] = relationship(back_populates="subscriptions")
    plan: Mapped["PricingPlan"] = relationship()
    payment: Mapped["Payment | None"] = relationship()

    __table_args__ = (
        Index("ix_user_subscriptions_user_status", "user_id", "status"),
    )
