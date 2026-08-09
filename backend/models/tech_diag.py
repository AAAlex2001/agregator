"""Техническое освидетельствование и диагностирование: анкеты исполнителей и поля заявки."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.license_holder import LicenseHolder
    from models.order import Order


class ExpertTechDiagProfile(Base):
    """Анкета специалиста НК (дефектоскописта): удостоверения, виды и объекты контроля."""
    __tablename__ = "expert_tech_diag_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    qualification_certificates: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    methods: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    control_objects: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="tech_diag_profile")


class LicenseHolderTechDiagProfile(Base):
    """Анкета лаборатории неразрушающего контроля — держателя разрешительных документов.

    Номера лицензии и аккредитации лаборатории с файлами живут в общей регистрации
    держателя; здесь только виды контроля и город организации.
    """
    __tablename__ = "license_holder_tech_diag_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    license_holder_id: Mapped[int] = mapped_column(
        ForeignKey("license_holders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    methods: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    organization_city: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    license_holder: Mapped["LicenseHolder"] = relationship(back_populates="tech_diag_profile")


class OrderTechDiagDetails(ApplicantColumns, Base):
    """Поля заявки на техническое освидетельствование и диагностирование."""
    __tablename__ = "order_tech_diag_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    purpose: Mapped[str] = mapped_column(Text, nullable=False, default="")
    object_city: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    duration: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    order: Mapped["Order"] = relationship(back_populates="tech_diag_details")
