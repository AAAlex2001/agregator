"""Telegram-каналы и группы, подключённые к аккаунту для публикаций."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base


class ChannelKind(StrEnum):
    """Вид чата в Telegram."""

    CHANNEL = "channel"
    GROUP = "group"
    SUPERGROUP = "supergroup"


class PosterChannel(Base):
    """Канал или группа владельца. Один чат могут подключить несколько администраторов."""

    __tablename__ = "poster_channels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        index=True,
    )
    chat_id: Mapped[int] = mapped_column(BigInteger, index=True)

    kind: Mapped[str] = mapped_column(String(16))
    title: Mapped[str] = mapped_column(String(255), default="")
    username: Mapped[str | None] = mapped_column(String(64))
    members_count: Mapped[int | None] = mapped_column(Integer)
    can_post: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    __table_args__ = (UniqueConstraint("owner_id", "chat_id", name="uq_poster_channels_owner_chat"),)

    @property
    def is_ready(self) -> bool:
        """В канал можно публиковать: бот на месте и с правами."""

        return self.is_active and self.can_post
