from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import Any

from sqlalchemy import DateTime, Enum, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class ArticleKind(str, PyEnum):
    NEWS = "NEWS"
    BLOG = "BLOG"


class ArticleStatus(str, PyEnum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Article(Base):
    "Статья (новость или блог)."
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[ArticleKind] = mapped_column(Enum(ArticleKind, name="articlekind"), nullable=False, index=True)
    status: Mapped[ArticleStatus] = mapped_column(
        Enum(ArticleStatus, name="articlestatus"),
        nullable=False,
        default=ArticleStatus.DRAFT,
        index=True,
    )

    slug: Mapped[str] = mapped_column(String(220), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    excerpt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cover_image: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    content_html: Mapped[str] = mapped_column(Text, nullable=False, default="")
    tags: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)

    meta_title: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    meta_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    meta_keywords: Mapped[str] = mapped_column(Text, nullable=False, default="")
    og_image: Mapped[str] = mapped_column(String(500), nullable=False, default="")

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        Index("ix_articles_kind_status_published", "kind", "status", "published_at"),
    )

    def __str__(self) -> str:
        return self.title or f"Article #{self.id}"
