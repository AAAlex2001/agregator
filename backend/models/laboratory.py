"""Лабораторные исследования: анкета исполнителя (1:1 к experts) и поля заявки (1:1 к orders)."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.order import Order


class ExpertLaboratoryProfile(Base):
    """Анкета исполнителя лабораторных исследований: область аккредитации и комментарий."""
    __tablename__ = "expert_laboratory_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    accreditation_area: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="laboratory_profile")


class OrderLaboratoryDetails(Base):
    """Поля заявки на лабораторные исследования: требования к оборудованию."""
    __tablename__ = "order_laboratory_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    equipment_requirements: Mapped[str] = mapped_column(Text, nullable=False, default="")

    order: Mapped["Order"] = relationship(back_populates="laboratory_details")
