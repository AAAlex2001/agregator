"""Инженерные изыскания: анкеты изыскателя и держателя-члена СРО, поля заявки."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.license_holder import LicenseHolder
    from models.order import Order


class ExpertSurveyProfile(Base):
    """Анкета изыскателя: образование, направления изысканий, НОК, НРС и аттестация РТН."""
    __tablename__ = "expert_survey_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    education: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    kinds: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    kinds_other: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    nok_passed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    nrs_number: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    sro_gip_declared: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    qualification_courses: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    rtn_areas: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    education_documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    nok_documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    nrs_documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    qualification_documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    rtn_documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="survey_profile")


class LicenseHolderSurveyProfile(Base):
    """Анкета держателя разрешительных документов — члена СРО изыскателей.

    Файл выписки из реестра СРО живёт в общей регистрации держателя
    (LicenseHolder.sro_survey_file_url); здесь данные членства и условия услуг.
    """
    __tablename__ = "license_holder_survey_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    license_holder_id: Mapped[int] = mapped_column(
        ForeignKey("license_holders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    sro_name: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    sro_registry_number: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    hazardous_objects_right: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    nuclear_objects_right: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    liability_level: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")
    pricing_kind: Mapped[str] = mapped_column(String(20), nullable=False, default="PERCENT", server_default="PERCENT")
    pricing_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    pricing_fixed_amount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    license_holder: Mapped["LicenseHolder"] = relationship(back_populates="survey_profile")


class OrderSurveyDetails(ApplicantColumns, Base):
    """Поля заявки на инженерные изыскания."""
    __tablename__ = "order_survey_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    kinds: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)

    order: Mapped["Order"] = relationship(back_populates="survey_details")
