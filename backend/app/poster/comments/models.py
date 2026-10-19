"""Комментарии к публикациям и их лайки.

Ответы собираются в ветку под корневым комментарием: parent_id — корень ветки,
reply_to_id — комментарий, на который отвечают.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, Text, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from models.account import Account

MAX_COMMENT_LENGTH = 2000

ROOTS_ONLY = text("parent_id IS NULL")


class PostComment(Base):
    """Комментарий или ответ в ветке."""

    __tablename__ = "post_comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True,
    )
    author_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        index=True,
    )
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("post_comments.id", ondelete="CASCADE"),
    )
    reply_to_id: Mapped[int | None] = mapped_column(
        ForeignKey("post_comments.id", ondelete="SET NULL"),
        index=True,
    )

    text: Mapped[str] = mapped_column(Text)
    likes_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    author: Mapped[Account] = relationship(lazy="joined")
    reply_to: Mapped["PostComment | None"] = relationship(
        remote_side=[id],
        foreign_keys=[reply_to_id],
        lazy="joined",
        join_depth=1,
    )

    __table_args__ = (
        Index(
            "ix_post_comments_roots",
            post_id,
            created_at,
            id,
            postgresql_where=ROOTS_ONLY,
        ),
        Index(
            "ix_post_comments_replies",
            parent_id,
            created_at,
            id,
        ),
    )

    @property
    def reply_to_name(self) -> str | None:
        """Кому ответ: имя автора комментария, на который отвечают."""

        if self.reply_to is None:
            return None

        return self.reply_to.author.display_name


class CommentLike(Base):
    """Лайк комментария. Пара пользователь–комментарий уникальна."""

    __tablename__ = "post_comment_likes"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    comment_id: Mapped[int] = mapped_column(
        ForeignKey("post_comments.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
