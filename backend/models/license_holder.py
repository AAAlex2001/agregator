"""Профиль держателя разрешительных документов: лицензии, аренда, уведомления."""
from datetime import UTC, datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.audit import LicenseHolderAuditProfile
    from models.tech_diag import LicenseHolderTechDiagProfile


class LicenseRentalKind(str, PyEnum):
    """Способ расчёта стоимости аренды лицензии"""
    PERCENT = "PERCENT"
    FIXED = "FIXED"
    NEGOTIABLE = "NEGOTIABLE"


class LicenseHolder(Base):
    """Ролевые данные держателя документов. Тумблеры — по событиям, адресованным держателю."""
    __tablename__ = "license_holders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    license_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    license_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    license_areas: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    mining_license_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mining_license_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    sro_design_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    lab_accreditation_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    lab_accreditation_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    company_card_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    license_rental_kind: Mapped[str | None] = mapped_column(String(20), nullable=True)
    license_rental_percent: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    license_rental_fixed_amount: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    email_on_order_updated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_bidding_finished: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_labor_listing: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "license_rental_kind IS NULL OR license_rental_kind IN ('PERCENT', 'FIXED', 'NEGOTIABLE')",
            name="ck_license_holders_rental_kind_valid",
        ),
    )

    account: Mapped["Account"] = relationship(back_populates="license_holder_profile")
    audit_profile: Mapped["LicenseHolderAuditProfile | None"] = relationship(
        back_populates="license_holder",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )
    tech_diag_profile: Mapped["LicenseHolderTechDiagProfile | None"] = relationship(
        back_populates="license_holder",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )
