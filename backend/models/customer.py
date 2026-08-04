"""Профиль заказчика: ролевые настройки уведомлений."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.audit import CustomerAuditProfile


class Customer(Base):
    """Ролевые данные заказчика. Тумблеры — по событиям, адресованным заказчику."""
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    email_on_response_created: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_response_updated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_expert_rejected: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_question_asked: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    account: Mapped["Account"] = relationship(back_populates="customer_profile")

    audit_profile: Mapped["CustomerAuditProfile | None"] = relationship(
        back_populates="customer",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )
