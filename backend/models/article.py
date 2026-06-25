from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base
from models.tag import Tag


class ArticleKind(str, PyEnum):
    NEWS = "NEWS"
    BLOG = "BLOG"


class ArticleStatus(str, PyEnum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


article_tags = Table(
    "article_tags",
    Base.metadata,
    Column("article_id", ForeignKey("articles.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Article(Base):
    """Статья (новость или блог)."""
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

    meta_title: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    meta_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    meta_keywords: Mapped[str] = mapped_column(Text, nullable=False, default="")
    og_image: Mapped[str] = mapped_column(String(500), nullable=False, default="")

    likes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    dislikes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

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

    tags: Mapped[list[Tag]] = relationship(secondary=article_tags, lazy="selectin", order_by="Tag.name")

    __table_args__ = (
        Index("ix_articles_kind_status_published", "kind", "status", "published_at"),
    )

    def __str__(self) -> str:
        return self.title or f"Article #{self.id}"
