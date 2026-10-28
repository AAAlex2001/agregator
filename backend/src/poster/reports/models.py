from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base import Base, utc_now
from src.poster.comments.models import PostComment
from src.poster.posts.models import Post

MAX_REPORT_LENGTH = 500


class ReportStatus(StrEnum):
    """Жалоба ждёт модератора или уже рассмотрена."""

    OPEN = "open"
    RESOLVED = "resolved"


class PostReport(Base):
    """Жалоба на пост или комментарий. Заполнено что-то одно: post_id или comment_id."""

    __tablename__ = "post_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    reporter_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    comment_id: Mapped[int | None] = mapped_column(ForeignKey("post_comments.id", ondelete="CASCADE"))
    reason: Mapped[str] = mapped_column(String(MAX_REPORT_LENGTH))
    status: Mapped[str] = mapped_column(String(16), default=ReportStatus.OPEN)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    post: Mapped[Post | None] = relationship(lazy="selectin", viewonly=True)
    comment: Mapped[PostComment | None] = relationship(lazy="selectin", viewonly=True)
