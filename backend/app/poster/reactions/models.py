"""Реакции на пост: лайки, просмотры и сохранения."""

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base


class PostLike(Base):
    """Лайк поста. Пара пользователь–пост уникальна."""

    __tablename__ = "post_likes"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PostView(Base):
    """Просмотр поста посетителем за день. Один посетитель — один просмотр в сутки."""

    __tablename__ = "post_views"

    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    visitor: Mapped[str] = mapped_column(String(64), primary_key=True)
    viewed_on: Mapped[date] = mapped_column(Date, primary_key=True)


class PostSave(Base):
    """Пост в «Сохранённом» у пользователя. Пара пользователь–пост уникальна."""

    __tablename__ = "post_saves"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index(
            "ix_post_saves_user_recent",
            user_id,
            created_at.desc(),
            post_id.desc(),
        ),
    )
