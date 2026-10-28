from datetime import datetime
from enum import StrEnum
from typing import Any

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base import Base, utc_now
from src.poster.delivery.models import PostDelivery

MAX_POST_HTML = 30000
MAX_POST_TEXT = 5000
MAX_POST_MEDIA = 10


class PostStatus(StrEnum):
    """Состояние поста: черновик, отложенный, опубликованный или скрытый модератором."""

    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    HIDDEN = "hidden"


class MediaKind(StrEnum):
    """Вид файла: фото или видео."""

    PHOTO = "photo"
    VIDEO = "video"


class Post(Base):
    """Пост автора: текст, фото и видео. Выходит на сайте и/или в Telegram-каналах."""

    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    repost_of_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    reply_to_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id", ondelete="SET NULL"))
    html: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default=PostStatus.DRAFT)
    on_site: Mapped[bool] = mapped_column(default=True)
    telegram: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    likes_count: Mapped[int] = mapped_column(default=0)
    comments_count: Mapped[int] = mapped_column(default=0)
    reposts_count: Mapped[int] = mapped_column(default=0)
    views_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    media: Mapped[list["PostMedia"]] = relationship(
        lazy="selectin",
        order_by="PostMedia.sort_order",
        cascade="all",
        passive_deletes=True,
    )
    repost_of: Mapped["Post | None"] = relationship(
        lazy="selectin",
        remote_side=[id],
        foreign_keys=[repost_of_id],
        viewonly=True,
    )
    deliveries: Mapped[list[PostDelivery]] = relationship(
        lazy="selectin",
        order_by=PostDelivery.id,
        back_populates="post",
        viewonly=True,
    )


class PostMedia(Base):
    """Фото или видео. Пока пост не сохранён, файл ни к чему не привязан: post_id пустой."""

    __tablename__ = "post_media"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    kind: Mapped[str] = mapped_column(String(16))
    path: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    @property
    def url(self) -> str:
        """Возвращает адрес файла на сайте."""
        return f"/uploads/{self.path}"
