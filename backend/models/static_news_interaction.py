from datetime import UTC, date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class StaticNewsMetric(Base):
    __tablename__ = "static_news_metrics"

    news_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    likes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    dislikes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    views_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class StaticNewsReaction(Base):
    __tablename__ = "static_news_reactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    news_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("static_news_metrics.news_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=True,
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(10), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (Index("uq_static_news_reaction_identity", "news_id", "visitor_key", unique=True),)


class StaticNewsView(Base):
    __tablename__ = "static_news_views"

    id: Mapped[int] = mapped_column(primary_key=True)
    news_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("static_news_metrics.news_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=True,
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False)
    viewed_on: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        Index(
            "uq_static_news_view_daily",
            "news_id",
            "visitor_key",
            "viewed_on",
            unique=True,
        ),
    )
