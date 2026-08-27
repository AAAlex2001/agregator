"""Заявки с публичных страниц сайта: форма в статьях и новостях."""
from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class LeadStatus(str, PyEnum):
    "Стадия обработки заявки менеджером."
    NEW = "NEW"
    IN_WORK = "IN_WORK"
    DONE = "DONE"
    SPAM = "SPAM"


class Lead(Base):
    "Заявка посетителя на подбор исполнителя по направлению."
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    direction: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    phone: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    company: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    inn: Mapped[str] = mapped_column(String(20), nullable=False, default="")
    region: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    work_kinds: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    object_name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    task: Mapped[str] = mapped_column(Text, nullable=False, default="")
    deadline: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    budget: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    source_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[LeadStatus] = mapped_column(
        Enum(LeadStatus, name="lead_status"),
        nullable=False,
        default=LeadStatus.NEW,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    def __str__(self) -> str:
        return f"Lead #{self.id}"
