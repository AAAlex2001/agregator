from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base import Base, utc_now

MAX_COMMENT_LENGTH = 2000


class PostComment(Base):
    """Комментарий к посту. parent_id — первый комментарий ветки, reply_to_id — на что ответили."""

    __tablename__ = "post_comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    author_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("post_comments.id", ondelete="CASCADE"))
    reply_to_id: Mapped[int | None] = mapped_column(ForeignKey("post_comments.id", ondelete="SET NULL"))
    text: Mapped[str] = mapped_column(Text)
    likes_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    reply_to: Mapped["PostComment | None"] = relationship(
        lazy="selectin",
        remote_side=[id],
        foreign_keys=[reply_to_id],
        viewonly=True,
    )


class CommentLike(Base):
    """Лайк пользователя под комментарием."""

    __tablename__ = "post_comment_likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)
    comment_id: Mapped[int] = mapped_column(
        ForeignKey("post_comments.id", ondelete="CASCADE"),
        primary_key=True,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
