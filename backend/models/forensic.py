"""Судебная экспертиза: анкета эксперта (1:1 к experts) и поля заявки (1:1 к orders)."""
from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.order import Order


class ForensicWorkplaceKind(str, PyEnum):
    """Кто выдаёт заключение судебной экспертизы"""
    ORGANIZATION = "ORGANIZATION"
    INDIVIDUAL = "INDIVIDUAL"


class ExpertForensicProfile(Base):
    """Анкета судебного эксперта: образование, опыт, учёная степень, место работы."""
    __tablename__ = "expert_forensic_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    education: Mapped[str] = mapped_column(Text, nullable=False, default="")
    education_diploma: Mapped[dict[str, str] | None] = mapped_column(JSONB, nullable=True)
    extra_education: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    has_similar_experience: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    has_degree: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    degree: Mapped[str] = mapped_column(String(300), nullable=False, default="", server_default="")
    city: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    workplace_kind: Mapped[ForensicWorkplaceKind] = mapped_column(
        Enum(ForensicWorkplaceKind),
        nullable=False,
        default=ForensicWorkplaceKind.INDIVIDUAL,
    )
    workplace_name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="forensic_profile")


class OrderForensicDetails(Base):
    """Поля заявки на судебную экспертизу: заявитель, объект, требования, сроки."""
    __tablename__ = "order_forensic_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    applicant_full_name: Mapped[str] = mapped_column(String(300), nullable=False, default="", server_default="")
    applicant_position: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    applicant_organization: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    applicant_inn: Mapped[str] = mapped_column(String(12), nullable=False, default="", server_default="")
    applicant_phone: Mapped[str] = mapped_column(String(30), nullable=False, default="", server_default="")
    applicant_email: Mapped[str] = mapped_column(String(320), nullable=False, default="", server_default="")
    expertise_purpose: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    government_body: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    city: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    education_requirement: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    extra_requirements: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    similar_experience_required: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    duration: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")

    order: Mapped["Order"] = relationship(back_populates="forensic_details")
