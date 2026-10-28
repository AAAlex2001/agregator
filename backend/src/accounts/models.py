from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import uuid4

from sqlalchemy import BigInteger, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now


class UserRole(StrEnum):
    """Роль аккаунта: заказчик, эксперт или держатель лицензии."""

    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"


def new_public_id() -> str:
    """Придумывает случайный публичный id аккаунта для ссылок."""
    return str(uuid4())


class Account(Base):
    """Аккаунт пользователя: вход, контакты и общие для всех ролей настройки. Один на пару почта+роль."""

    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, default=new_public_id)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="userrole"))
    is_active: Mapped[bool] = mapped_column(default=True)
    email: Mapped[str | None] = mapped_column(String)
    email_verified: Mapped[bool] = mapped_column(default=False)
    phone: Mapped[str | None] = mapped_column(String)
    password: Mapped[str] = mapped_column(String)
    telegram_id: Mapped[int | None] = mapped_column(BigInteger)
    first_name: Mapped[str | None] = mapped_column(String(100))
    last_name: Mapped[str | None] = mapped_column(String(100))
    inn: Mapped[str | None] = mapped_column(String(12))
    company_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    avatar_url: Mapped[str | None] = mapped_column(String)
    notify_telegram_enabled: Mapped[bool] = mapped_column(default=True)
    notifications_introduced: Mapped[bool] = mapped_column(default=False)
    notification_unread_count: Mapped[int] = mapped_column(default=0)
    email_on_chat_message: Mapped[bool] = mapped_column(default=True)
    email_on_new_blog_post: Mapped[bool] = mapped_column(default=True)
    following_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    @property
    def display_name(self) -> str:
        """Возвращает публичное имя: имя и фамилию, а если их нет — «Пользователь»."""
        return " ".join(part for part in (self.first_name, self.last_name) if part) or "Пользователь"
