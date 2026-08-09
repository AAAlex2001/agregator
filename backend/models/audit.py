"""Аудит СУПБ: анкеты заказчика и исполнителя, поля заявки и список ОПО."""
from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.customer import Customer
    from models.expert import Expert
    from models.license_holder import LicenseHolder
    from models.order import Order


class AuditScale(str, PyEnum):
    """Масштаб аудита: один ОПО, все ОПО организации или выборочные"""
    SINGLE_OPO = "SINGLE_OPO"
    ALL_OPO = "ALL_OPO"
    SELECTED_OPO = "SELECTED_OPO"


class AuditKind(str, PyEnum):
    """Тип запрашиваемого аудита"""
    BASIC = "BASIC"
    INTERIM = "INTERIM"
    SELECTIVE = "SELECTIVE"
    CONSULTATION = "CONSULTATION"


class AuditTimeline(str, PyEnum):
    """Желаемые сроки проведения аудита"""
    MONTH_URGENT = "MONTH_URGENT"
    CURRENT_QUARTER = "CURRENT_QUARTER"
    NEXT_QUARTER = "NEXT_QUARTER"
    CONSULTATION = "CONSULTATION"


class CustomerAuditProfile(Base):
    """Анкета заказчика по аудиту СУПБ: должность представителя и лицензия на эксплуатацию ОПО."""
    __tablename__ = "customer_audit_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    position: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    opo_license_number: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    customer: Mapped["Customer"] = relationship(back_populates="audit_profile")


class ExpertAuditProfile(Base):
    """Анкета исполнителя-аудитора по аудиту СУПБ: аттестации, НОК и документы."""
    __tablename__ = "expert_audit_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    industrial_safety_areas: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    expert_attestation_areas: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    audit_qualifications: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="audit_profile")


class LicenseHolderAuditProfile(Base):
    """Анкета аккредитованного инспекционного органа — держателя разрешительных документов.

    Наименования, ИНН и контакты живут в общей регистрации держателя; здесь только
    свидетельство об аккредитации и области аккредитации по аудиту СУПБ.
    """
    __tablename__ = "license_holder_audit_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    license_holder_id: Mapped[int] = mapped_column(
        ForeignKey("license_holders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    certificate_number: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    accreditation_areas: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    license_holder: Mapped["LicenseHolder"] = relationship(back_populates="audit_profile")


class OrderAuditDetails(ApplicantColumns, Base):
    """Поля заявки на аудит СУПБ: заявитель, объект аудита, параметры, сроки, файлы."""
    __tablename__ = "order_audit_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    audit_scale: Mapped[AuditScale] = mapped_column(Enum(AuditScale), nullable=False)
    opo_total: Mapped[int | None] = mapped_column(Integer, nullable=True)
    opo_class_1: Mapped[int | None] = mapped_column(Integer, nullable=True)
    opo_class_2: Mapped[int | None] = mapped_column(Integer, nullable=True)
    opo_class_3: Mapped[int | None] = mapped_column(Integer, nullable=True)
    opo_class_4: Mapped[int | None] = mapped_column(Integer, nullable=True)
    main_industry: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    multiple_regions: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    registration_certificate: Mapped[dict[str, str] | None] = mapped_column(JSONB, nullable=True)
    audit_kind: Mapped[AuditKind] = mapped_column(Enum(AuditKind), nullable=False)
    considers_sto: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    sto_name: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    sto_file: Mapped[dict[str, str] | None] = mapped_column(JSONB, nullable=True)
    audit_areas: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    desired_timeline: Mapped[AuditTimeline] = mapped_column(Enum(AuditTimeline), nullable=False)
    comments: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")

    order: Mapped["Order"] = relationship(back_populates="audit_details")
    opo_items: Mapped[list["OrderAuditOpoItem"]] = relationship(
        back_populates="details",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="OrderAuditOpoItem.position",
        lazy="selectin",
    )


class OrderAuditOpoItem(Base):
    """Один ОПО в заявке на аудит: для одного объекта — ровно одна строка, для выборочных — список."""
    __tablename__ = "order_audit_opo_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    details_id: Mapped[int] = mapped_column(
        ForeignKey("order_audit_details.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    registration_number: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    hazard_class: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    address: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    industry: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    hazard_signs: Mapped[str] = mapped_column(String(1000), nullable=False, default="")

    details: Mapped["OrderAuditDetails"] = relationship(back_populates="opo_items")
