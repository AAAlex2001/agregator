"""Запросы к ИИ-помощнику. Хранится только время — для лимита запросов в час."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base

MAX_AI_INSTRUCTION = 1000


class AiRequest(Base):
    """Один запрос пользователя к ИИ."""

    __tablename__ = "post_ai_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index(
            "ix_post_ai_requests_user_created",
            user_id,
            created_at,
        ),
    )
