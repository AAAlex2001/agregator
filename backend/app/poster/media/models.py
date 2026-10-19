"""Фото и видео к посту. Загружаются до публикации, к посту привязываются при сохранении."""

from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base

if TYPE_CHECKING:
    from app.poster.publications.models import Post

MAX_POST_MEDIA = 10

FREE_MEDIA_ONLY = text("post_id IS NULL")


class MediaKind(StrEnum):
    """Что загружено: фото или видео."""

    PHOTO = "photo"
    VIDEO = "video"


class PostMedia(Base):
    """Файл поста. Пока post_id пуст, файл свободен и удалится через сутки."""

    __tablename__ = "post_media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        index=True,
    )
    post_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True,
    )

    kind: Mapped[str] = mapped_column(String(16))
    path: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    post: Mapped["Post | None"] = relationship(back_populates="media")

    __table_args__ = (
        CheckConstraint(
            "kind IN ('photo', 'video')",
            name="ck_post_media_kind",
        ),
        Index(
            "ix_post_media_free_owner",
            owner_id,
            postgresql_where=FREE_MEDIA_ONLY,
        ),
        Index(
            "ix_post_media_expired",
            created_at,
            id,
            postgresql_where=FREE_MEDIA_ONLY,
        ),
    )

    @property
    def url(self) -> str:
        """Адрес файла для сайта."""

        return f"/uploads/{self.path}"
