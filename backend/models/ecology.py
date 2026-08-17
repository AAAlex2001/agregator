"""Экологическое сопровождение предприятий: анкета эколога и поля заявки."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.order import Order


class ExpertEcologyProfile(Base):
    """Анкета эколога: виды работ, практические навыки и подтверждающие документы."""
    __tablename__ = "expert_ecology_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    work_types: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    practical_skills: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="ecology_profile")


class OrderEcologyDetails(ApplicantColumns, Base):
    """Поля заявки на экологическое сопровождение."""
    __tablename__ = "order_ecology_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    work_types: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)

    order: Mapped["Order"] = relationship(back_populates="ecology_details")
