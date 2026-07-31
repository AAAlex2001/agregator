"""Профиль исполнителя: карта, сертификаты, продажа контактов, уведомления."""
from datetime import UTC, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

CONTACT_DISCLOSURE_CONSENT_VERSION = "2026-07-21"

if TYPE_CHECKING:
    from models.account import Account
    from models.direction_profile import ExpertCadastralProfile, ExpertForensicProfile


class Expert(Base):
    """Ролевые данные исполнителя. Тумблеры — по событиям, адресованным исполнителю."""
    __tablename__ = "experts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1), nullable=True)
    review_count: Mapped[int] = mapped_column(default=0, nullable=False, server_default="0")
    certificates: Mapped[list[dict[str, str]] | None] = mapped_column(JSONB, nullable=True)
    location_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location_city: Mapped[str | None] = mapped_column(String(200), nullable=True)
    travels_to_other_regions: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    show_on_map: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    map_fields: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    contact_sales_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    contact_price_kopecks: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    contact_payment_details_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    contact_disclosure_consent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    contact_disclosure_consent_version: Mapped[str | None] = mapped_column(String(30), nullable=True)
    notify_order_types: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    email_on_order_updated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_bidding_finished: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_question_answered: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_labor_listing: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "contact_price_kopecks IS NULL OR contact_price_kopecks > 0",
            name="ck_experts_contact_price_positive",
        ),
    )

    account: Mapped["Account"] = relationship(back_populates="expert_profile")

    cadastral_profile: Mapped["ExpertCadastralProfile | None"] = relationship(
        back_populates="expert",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )

    forensic_profile: Mapped["ExpertForensicProfile | None"] = relationship(
        back_populates="expert",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )
