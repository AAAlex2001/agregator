from datetime import datetime
from enum import StrEnum

from sqlalchemy import BigInteger, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now


class ChannelKind(StrEnum):
    """Вид Telegram-чата: канал, группа или супергруппа."""

    CHANNEL = "channel"
    GROUP = "group"
    SUPERGROUP = "supergroup"


class PosterChannel(Base):
    """Telegram-канал или группа, подключённые автором для публикаций."""

    __tablename__ = "poster_channels"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    chat_id: Mapped[int] = mapped_column(BigInteger)
    kind: Mapped[str] = mapped_column(String(16))
    title: Mapped[str] = mapped_column(String(255), default="")
    username: Mapped[str | None] = mapped_column(String(64))
    members_count: Mapped[int | None]
    can_post: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )
