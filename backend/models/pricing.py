from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from models.base import Base


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

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    name = Column(String(100), nullable=False)
    badge = Column(String(50), nullable=True)
    price_kopecks = Column(BigInteger, nullable=False)
    period_label = Column(String(50), nullable=False)
    duration_days = Column(Integer, nullable=True)
    description = Column(String(500), nullable=False, default="")
    cta_label = Column(String(100), nullable=False)
    features = Column(JSONB, nullable=False, default=list)
    highlighted = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("kind", name="uq_pricing_plans_kind"),
    )


class UserSubscription(Base):
    "Купленная пользователем подписка. Разовая — со счётчиком откликов, срочная — с expires_at."
    __tablename__ = "user_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_id = Column(
        Integer,
        ForeignKey("pricing_plans.id", ondelete="RESTRICT"),
        nullable=False,
    )
    kind = Column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    status = Column(
        Enum(SubscriptionStatus, name="subscriptionstatus"),
        nullable=False,
        default=SubscriptionStatus.ACTIVE,
        index=True,
    )
    activated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    responses_remaining = Column(Integer, nullable=True)
    payment_id = Column(
        Integer,
        ForeignKey("payments.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="subscriptions")
    plan = relationship("PricingPlan")
    payment = relationship("Payment")

    __table_args__ = (
        Index("ix_user_subscriptions_user_status", "user_id", "status"),
    )
