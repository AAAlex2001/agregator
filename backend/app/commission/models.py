"""Конкурсная комиссия: заявки кандидатов в эксперты с их аттестациями.

Кандидат не регистрируется: оставляет контакты и аттестации, комиссия рассматривает заявку
в админке и сообщает решение письмом.
"""

from datetime import datetime
from enum import StrEnum
from typing import Any

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base
from app.core.clock import now


class ApplicationStatus(StrEnum):
    """Новая, на рассмотрении, кандидат принят или получил отказ."""

    NEW = "new"
    REVIEWING = "reviewing"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class CommissionApplication(Base):
    """Заявка кандидата: контакты, аттестации, решение комиссии и комментарий к нему."""

    __tablename__ = "commission_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(32))
    email: Mapped[str] = mapped_column(String(320))
    attestations: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list)
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16), default=ApplicationStatus.NEW, index=True)
    decision: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
