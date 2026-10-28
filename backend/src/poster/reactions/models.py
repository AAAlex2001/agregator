from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now


class PostLike(Base):
    """Лайк пользователя под постом."""

    __tablename__ = "post_likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class PostSave(Base):
    """Пост, который пользователь сохранил себе."""

    __tablename__ = "post_saves"

    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class PostView(Base):
    """Просмотр поста: один посетитель засчитывается раз в день."""

    __tablename__ = "post_views"

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    visitor: Mapped[str] = mapped_column(String(64), primary_key=True)
    viewed_on: Mapped[date] = mapped_column(Date, primary_key=True)
