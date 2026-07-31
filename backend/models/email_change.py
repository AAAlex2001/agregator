from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account

CODE_TTL_MINUTES = 15


def default_expires_at() -> datetime:
    return datetime.now(UTC) + timedelta(minutes=CODE_TTL_MINUTES)


class EmailChangeRequest(Base):
    "Заявка на смену email — код, отправленный на новый адрес, ждёт подтверждения юзером."

    __tablename__ = "email_change_requests"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_email_change_requests_user"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    new_email: Mapped[str] = mapped_column(String, nullable=False)
    code: Mapped[str] = mapped_column(String(10), nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=default_expires_at,
        nullable=False,
    )

    user: Mapped["Account"] = relationship()
