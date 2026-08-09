"""Кадастровые работы: анкета инженера (1:1 к experts) и поля заявки (1:1 к orders)."""
from datetime import UTC, date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.order import Order


class ExpertCadastralProfile(Base):
    """Анкета кадастрового инженера: образование, реестр, оборудование, место работы."""
    __tablename__ = "expert_cadastral_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    education: Mapped[str] = mapped_column(Text, nullable=False, default="")
    education_diploma: Mapped[dict[str, str] | None] = mapped_column(JSONB, nullable=True)
    registry_joined_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    certificate_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    registry_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    certificate_file: Mapped[dict[str, str] | None] = mapped_column(JSONB, nullable=True)
    has_equipment: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    city: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    workplace: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="cadastral_profile")


class OrderCadastralDetails(ApplicantColumns, Base):
    """Поля заявки на кадастровые работы: заявитель, работа, требования, сроки."""
    __tablename__ = "order_cadastral_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    work_purpose: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    city: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    education_requirement: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    sro_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    duration: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")

    order: Mapped["Order"] = relationship(back_populates="cadastral_details")
