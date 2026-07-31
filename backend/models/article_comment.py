from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account


class ArticleComment(Base):
    "Комментарий к статье. parent_id != None — это ответ на другой комментарий."
    __tablename__ = "article_comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    article_id: Mapped[int] = mapped_column(
        ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"), nullable=True, index=True
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("article_comments.id", ondelete="CASCADE"), nullable=True, index=True
    )
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    user: Mapped["Account"] = relationship("Account", lazy="selectin")

    def __str__(self) -> str:
        return f"Comment #{self.id}"
