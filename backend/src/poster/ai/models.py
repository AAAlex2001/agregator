from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now

MAX_AI_INSTRUCTION = 1000


class AiRequest(Base):
    """Запрос пользователя к ИИ-помощнику. Хранится только время — для лимита в час."""

    __tablename__ = "post_ai_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
