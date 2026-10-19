"""Публикация: текст из редактора, фото и видео. Репост — тот же пост со ссылкой на оригинал.

Пост выходит на сайте (on_site) и/или в подключённых Telegram-каналах (deliveries).
"""

from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from models.account import Account

if TYPE_CHECKING:
    from app.poster.delivery.models import PostDelivery
    from app.poster.media.models import PostMedia

MAX_POST_HTML = 30000
MAX_POST_TEXT = 5000

PUBLISHED_ONLY = text("status = 'published'")
SITEMAP_ONLY = text("status = 'published' AND repost_of_id IS NULL")
SCHEDULED_ONLY = text("status = 'scheduled'")


class PostStatus(StrEnum):
    """Состояние публикации. Читателям виден только опубликованный пост."""

    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    HIDDEN = "hidden"


class Post(Base):
    """Публикация пользователя. У репоста repost_of_id — оригинал, html — комментарий к нему.

    reply_to_id — свой прошлый пост, на который этот отвечает в Telegram.
    """

    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    repost_of_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True,
    )
    reply_to_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="SET NULL"),
        index=True,
    )

    html: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default=PostStatus.DRAFT, index=True)
    on_site: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    telegram: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, server_default="{}")
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    likes_count: Mapped[int] = mapped_column(Integer, default=0)
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    reposts_count: Mapped[int] = mapped_column(Integer, default=0)
    views_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    author: Mapped[Account] = relationship(lazy="joined")
    media: Mapped[list["PostMedia"]] = relationship(
        back_populates="post",
        lazy="selectin",
        order_by="PostMedia.sort_order, PostMedia.id",
        cascade="all, delete-orphan",
    )
    repost_of: Mapped["Post | None"] = relationship(
        remote_side=[id],
        foreign_keys=[repost_of_id],
        lazy="joined",
        join_depth=1,
    )
    deliveries: Mapped[list["PostDelivery"]] = relationship(
        lazy="selectin",
        order_by="PostDelivery.id",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('draft', 'scheduled', 'published', 'hidden')",
            name="ck_posts_status",
        ),
        Index(
            "ix_posts_feed",
            func.coalesce(published_at, created_at).desc(),
            id.desc(),
            postgresql_where=PUBLISHED_ONLY,
        ),
        Index(
            "ix_posts_author_status_feed",
            author_id,
            status,
            func.coalesce(published_at, created_at).desc(),
            id.desc(),
        ),
        Index(
            "ix_posts_author_published",
            author_id,
            published_at,
            postgresql_where=PUBLISHED_ONLY,
        ),
        Index(
            "ix_posts_scheduled",
            scheduled_at,
            postgresql_where=SCHEDULED_ONLY,
        ),
        Index(
            "ix_posts_sitemap",
            id,
            postgresql_where=SITEMAP_ONLY,
            postgresql_include=["updated_at"],
        ),
    )
