from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import JSON, Boolean, Column, DateTime, Enum, ForeignKey, Integer, String

from models.base import Base


class NotificationType(str, PyEnum):
    RESPONSE_UPDATED = "RESPONSE_UPDATED"
    RESPONSE_STATUS_CHANGED = "RESPONSE_STATUS_CHANGED"
    CHAT_MESSAGE = "CHAT_MESSAGE"
    QUESTION_ASKED = "QUESTION_ASKED"
    QUESTION_ANSWERED = "QUESTION_ANSWERED"
    SUPPORT_REPLY = "SUPPORT_REPLY"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(Enum(NotificationType, name="notificationtype"), nullable=False, index=True)
    payload = Column(JSON, nullable=False, default=dict, server_default="{}")
    action_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False, server_default="false", index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
