"""Профили направлений исполнителя: по таблице на направление, 1:1 к experts."""
from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert


class ForensicWorkplaceKind(str, PyEnum):
    """Кто выдаёт заключение судебной экспертизы"""
    ORGANIZATION = "ORGANIZATION"
    INDIVIDUAL = "INDIVIDUAL"


class ExpertCadastralProfile(Base):
    """Профиль кадастрового инженера."""
    __tablename__ = "expert_cadastral_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    education: Mapped[str] = mapped_column(Text, nullable=False, default="")
    registry_joined_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    certificate_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    registry_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    equipment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    workplace: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    documents: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="cadastral_profile")


class ExpertForensicProfile(Base):
    """Профиль специалиста по судебной экспертизе."""
    __tablename__ = "expert_forensic_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    education: Mapped[str] = mapped_column(Text, nullable=False, default="")
    similar_cases_experience: Mapped[str] = mapped_column(Text, nullable=False, default="")
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
