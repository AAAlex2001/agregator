"""Приглашения исполнителей, фонд программы и бонусы. Суммы — в копейках."""

from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import BigInteger, Boolean, CheckConstraint, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class ReferralStatus(StrEnum):
    """Результат участия приглашённого исполнителя."""

    PENDING = "PENDING"
    REWARDED = "REWARDED"
    POOL_EXHAUSTED = "POOL_EXHAUSTED"
    REJECTED = "REJECTED"


class ReferralCampaign(Base):
    """Размер фонда и сумма уже выданных вознаграждений."""

    __tablename__ = "referral_campaigns"

    id: Mapped[int] = mapped_column(primary_key=True)
    total_kopecks: Mapped[int] = mapped_column(BigInteger)
    reward_kopecks: Mapped[int] = mapped_column(BigInteger)
    spent_kopecks: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")

    __table_args__ = (
        CheckConstraint("total_kopecks >= 0", name="ck_referral_total_nonnegative"),
        CheckConstraint("reward_kopecks > 0", name="ck_referral_reward_positive"),
        CheckConstraint(
            "spent_kopecks >= 0 AND spent_kopecks <= total_kopecks",
            name="ck_referral_spent_within_pool",
        ),
    )

    @property
    def remaining_kopecks(self) -> int:
        """Возвращает невыданную часть фонда в копейках."""
        return self.total_kopecks - self.spent_kopecks


class Referral(Base):
    """Участие по каноническому email; сохраняется после удаления приглашённого аккаунта."""

    __tablename__ = "referrals"

    id: Mapped[int] = mapped_column(primary_key=True)
    inviter_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    invited_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
    )
    invited_email: Mapped[str] = mapped_column(String(320), unique=True)
    status: Mapped[ReferralStatus] = mapped_column(
        Enum(ReferralStatus, name="referralstatus"),
        default=ReferralStatus.PENDING,
        server_default=ReferralStatus.PENDING.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    rewarded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (CheckConstraint("inviter_id <> invited_id", name="ck_referral_not_self"),)


class BonusAccount(Base):
    """Бонусный баланс исполнителя для использования на сайте."""

    __tablename__ = "bonus_accounts"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="RESTRICT"),
        primary_key=True,
    )
    balance_kopecks: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")

    __table_args__ = (CheckConstraint("balance_kopecks >= 0", name="ck_bonus_balance_nonnegative"),)


class BonusTransaction(Base):
    """Одно начисление на приглашение; записи сохраняют историю бонусов."""

    __tablename__ = "bonus_transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("bonus_accounts.user_id", ondelete="RESTRICT"),
        index=True,
    )
    referral_id: Mapped[int] = mapped_column(
        ForeignKey("referrals.id", ondelete="RESTRICT"),
        unique=True,
    )
    amount_kopecks: Mapped[int] = mapped_column(BigInteger)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )

    __table_args__ = (CheckConstraint("amount_kopecks > 0", name="ck_bonus_amount_positive"),)
