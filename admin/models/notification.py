from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class NotificationType(str, PyEnum):
    RESPONSE_UPDATED = "RESPONSE_UPDATED"
    RESPONSE_STATUS_CHANGED = "RESPONSE_STATUS_CHANGED"
    CHAT_MESSAGE = "CHAT_MESSAGE"
    QUESTION_ASKED = "QUESTION_ASKED"
    QUESTION_ANSWERED = "QUESTION_ANSWERED"
    SUPPORT_REPLY = "SUPPORT_REPLY"


class Notification(Base):
    "Уведомление пользователю."
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="notificationtype"), nullable=False, index=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict, server_default="{}")
    action_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False, index=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
