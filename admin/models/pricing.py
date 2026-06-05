from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from models.base import Base


class SubscriptionKind(str, PyEnum):
    SINGLE = "SINGLE"
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"

    def __str__(self):
        labels = {"SINGLE": "Разовый", "MONTHLY": "Месяц", "YEARLY": "Год"}
        return labels.get(self.value, self.value)


class SubscriptionStatus(str, PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    USED = "USED"

    def __str__(self):
        labels = {
            "PENDING": "Ждёт оплату",
            "ACTIVE": "Активна",
            "EXPIRED": "Истекла",
            "USED": "Использована",
        }
        return labels.get(self.value, self.value)


class PricingPlan(Base):
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
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (UniqueConstraint("kind", name="uq_pricing_plans_kind"),)

    def __str__(self):
        return f"{self.name} — {self.price_kopecks / 100:.0f} ₽"


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("pricing_plans.id", ondelete="RESTRICT"), nullable=False)
    kind = Column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    status = Column(Enum(SubscriptionStatus, name="subscriptionstatus"), nullable=False, default=SubscriptionStatus.ACTIVE, index=True)
    activated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    responses_remaining = Column(Integer, nullable=True)
    payment_id = Column(Integer, ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    user = relationship("User", back_populates="subscriptions")
    plan = relationship("PricingPlan")
    payment = relationship("Payment")

    def __str__(self):
        return f"Подписка #{self.id} [{str(self.status)}]"
