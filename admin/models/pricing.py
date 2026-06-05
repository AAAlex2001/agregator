from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.payment import Payment
    from models.user import User


class SubscriptionKind(str, PyEnum):
    SINGLE = "SINGLE"
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"

    def __str__(self) -> str:
        labels = {"SINGLE": "Разовый", "MONTHLY": "Месяц", "YEARLY": "Год"}
        return labels.get(self.value, self.value)


class SubscriptionStatus(str, PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    USED = "USED"

    def __str__(self) -> str:
        labels = {
            "PENDING": "Ждёт оплату",
            "ACTIVE": "Активна",
            "EXPIRED": "Истекла",
            "USED": "Использована",
        }
        return labels.get(self.value, self.value)


class PricingPlan(Base):
    "Тарифный план."
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
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (UniqueConstraint("kind", name="uq_pricing_plans_kind"),)

    def __str__(self) -> str:
        return f"{self.name} — {self.price_kopecks / 100:.0f} ₽"


class UserSubscription(Base):
    "Подписка пользователя на тарифный план."
    __tablename__ = "user_subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("pricing_plans.id", ondelete="RESTRICT"), nullable=False)
    kind: Mapped[SubscriptionKind] = mapped_column(Enum(SubscriptionKind, name="subscriptionkind"), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(Enum(SubscriptionStatus, name="subscriptionstatus"), nullable=False, default=SubscriptionStatus.ACTIVE, index=True)
    activated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    responses_remaining: Mapped[int | None] = mapped_column(nullable=True)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    user: Mapped["User"] = relationship(back_populates="subscriptions")
    plan: Mapped["PricingPlan"] = relationship()
    payment: Mapped["Payment | None"] = relationship()

    def __str__(self) -> str:
        return f"Подписка #{self.id} [{str(self.status)}]"
