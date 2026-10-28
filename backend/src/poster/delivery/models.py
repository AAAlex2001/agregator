from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base import Base, utc_now
from src.poster.channels.models import PosterChannel

if TYPE_CHECKING:
    from src.poster.posts.models import Post


class DeliveryStatus(StrEnum):
    """Как идёт отправка в канал: ждёт, отправлен, не отправился или удалён."""

    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    DELETED = "deleted"


class PostDelivery(Base):
    """Пост в одном Telegram-канале и id его сообщений там."""

    __tablename__ = "post_deliveries"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    channel_id: Mapped[int] = mapped_column(ForeignKey("poster_channels.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column(String(16), default=DeliveryStatus.PENDING)
    message_ids: Mapped[list[int]] = mapped_column(JSONB, default=list)
    error: Mapped[str | None] = mapped_column(Text)
    attempts: Mapped[int] = mapped_column(default=0)
    next_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delete_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    channel: Mapped[PosterChannel] = relationship(lazy="selectin")
    post: Mapped["Post"] = relationship(lazy="selectin", back_populates="deliveries")
