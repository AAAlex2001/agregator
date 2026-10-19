"""Жалобы на посты и комментарии. Модератор скрывает пост, удаляет комментарий или отклоняет жалобу."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from app.poster.comments.models import PostComment
from app.poster.publications.models import Post
from models.account import Account

MAX_REPORT_LENGTH = 500

OPEN_ONLY = text("status = 'open'")


class ReportStatus(StrEnum):
    """Жалоба ждёт модератора или уже рассмотрена."""

    OPEN = "open"
    RESOLVED = "resolved"


class PostReport(Base):
    """Жалоба на пост или на комментарий. Открытая жалоба от одного человека — одна."""

    __tablename__ = "post_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reporter_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        index=True,
    )
    post_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True,
    )
    comment_id: Mapped[int | None] = mapped_column(
        ForeignKey("post_comments.id", ondelete="CASCADE"),
        index=True,
    )

    reason: Mapped[str] = mapped_column(String(MAX_REPORT_LENGTH))
    status: Mapped[str] = mapped_column(String(16), default=ReportStatus.OPEN)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reporter: Mapped[Account] = relationship(lazy="joined")
    post: Mapped[Post | None] = relationship(lazy="joined")
    comment: Mapped[PostComment | None] = relationship(lazy="joined")

    __table_args__ = (
        CheckConstraint(
            "status IN ('open', 'resolved')",
            name="ck_post_reports_status",
        ),
        Index(
            "ix_post_reports_status_recent",
            status,
            created_at.desc(),
            id.desc(),
        ),
        Index(
            "ux_post_reports_open_post",
            reporter_id,
            post_id,
            unique=True,
            postgresql_where=OPEN_ONLY,
        ),
        Index(
            "ux_post_reports_open_comment",
            reporter_id,
            comment_id,
            unique=True,
            postgresql_where=OPEN_ONLY,
        ),
    )
