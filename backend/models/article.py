from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from models.base import Base


class ArticleKind(str, PyEnum):
    NEWS = "NEWS"
    BLOG = "BLOG"


class ArticleStatus(str, PyEnum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True)
    kind = Column(Enum(ArticleKind, name="articlekind"), nullable=False, index=True)
    status = Column(
        Enum(ArticleStatus, name="articlestatus"),
        nullable=False,
        default=ArticleStatus.DRAFT,
        index=True,
    )

    slug = Column(String(220), nullable=False, unique=True, index=True)
    title = Column(String(300), nullable=False, default="")
    excerpt = Column(Text, nullable=False, default="")
    cover_image = Column(String(500), nullable=False, default="")
    content_html = Column(Text, nullable=False, default="")
    tags = Column(JSONB, nullable=False, default=list)

    meta_title = Column(String(300), nullable=False, default="")
    meta_description = Column(Text, nullable=False, default="")
    meta_keywords = Column(Text, nullable=False, default="")
    og_image = Column(String(500), nullable=False, default="")

    published_at = Column(DateTime(timezone=True), nullable=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        Index("ix_articles_kind_status_published", "kind", "status", "published_at"),
    )

    def __str__(self):
        return self.title or f"Article #{self.id}"
