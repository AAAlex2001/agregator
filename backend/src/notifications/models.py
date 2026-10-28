from datetime import datetime
from enum import StrEnum
from typing import Any

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now


class NotificationType(StrEnum):
    """О чём уведомление. Список совпадает с типом notificationtype в базе."""

    RESPONSE_UPDATED = "RESPONSE_UPDATED"
    RESPONSE_STATUS_CHANGED = "RESPONSE_STATUS_CHANGED"
    CHAT_MESSAGE = "CHAT_MESSAGE"
    QUESTION_ASKED = "QUESTION_ASKED"
    QUESTION_ANSWERED = "QUESTION_ANSWERED"
    SUPPORT_REPLY = "SUPPORT_REPLY"
    NEW_BLOG_POST = "NEW_BLOG_POST"
    NEW_ORDER = "NEW_ORDER"
    CONTACT_ACCESS = "CONTACT_ACCESS"
    LABOR_RESPONSE = "LABOR_RESPONSE"
    POST_ACTIVITY = "POST_ACTIVITY"
    BLITZ_ORDER = "BLITZ_ORDER"


class Notification(Base):
    """Уведомление в личном кабинете. action_url — куда ведёт клик по уведомлению."""

    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="notificationtype"))
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    action_url: Mapped[str | None] = mapped_column(String(500))
    is_read: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
