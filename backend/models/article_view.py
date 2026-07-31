from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class ArticleView(Base):
    """Уникальный просмотр статьи зарегистрированным пользователем."""
    __tablename__ = "article_views"

    id: Mapped[int] = mapped_column(primary_key=True)
    article_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=True
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (Index("ix_article_views_identity_created", "article_id", "visitor_key", "created_at"),)
