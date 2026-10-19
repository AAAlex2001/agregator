"""Доставка поста в Telegram-канал: очередь отправки и id сообщений для правки и удаления."""

from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint, func, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base

if TYPE_CHECKING:
    from app.poster.channels.models import PosterChannel

MAX_ATTEMPTS = 3

PENDING_ONLY = text("status = 'pending'")


class DeliveryStatus(StrEnum):
    """Ждёт отправки, отправляется, отправлен, не удалось или удалён из канала."""

    PENDING = "pending"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"
    DELETED = "deleted"


class PostDelivery(Base):
    """Пост в одном канале. Пара пост–канал уникальна."""

    __tablename__ = "post_deliveries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True,
    )
    channel_id: Mapped[int] = mapped_column(
        ForeignKey("poster_channels.id", ondelete="CASCADE"),
        index=True,
    )

    status: Mapped[str] = mapped_column(String(16), default=DeliveryStatus.PENDING)
    message_ids: Mapped[list[Any]] = mapped_column(JSONB, default=list)
    error: Mapped[str | None] = mapped_column(Text)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    next_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    channel: Mapped["PosterChannel"] = relationship(lazy="joined")

    __table_args__ = (
        UniqueConstraint("post_id", "channel_id", name="uq_post_deliveries_post_channel"),
        Index("ix_post_deliveries_pending", "id", postgresql_where=PENDING_ONLY),
    )
