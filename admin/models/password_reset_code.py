from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account


class PasswordResetCode(Base):
    "Код для сброса пароля пользователя."
    __tablename__ = "password_reset_codes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String, nullable=False, index=True)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC) + timedelta(minutes=15), nullable=False)

    account: Mapped["Account"] = relationship(back_populates="password_reset_codes")
