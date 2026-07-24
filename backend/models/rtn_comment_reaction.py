from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class CommentReactionValue(str, PyEnum):
    "Реакция на комментарий вместо обычного лайка."
    USEFUL = "USEFUL"
    CLARIFICATION = "CLARIFICATION"
    AGREE = "AGREE"


class RtnCommentReaction(Base):
    "Реакция на комментарий: одна на пару (комментарий, посетитель), её можно сменить или убрать."
    __tablename__ = "rtn_comment_reactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    comment_id: Mapped[int] = mapped_column(
        ForeignKey("rtn_comments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    value: Mapped[CommentReactionValue] = mapped_column(
        Enum(CommentReactionValue, name="rtn_comment_reaction_value"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    __table_args__ = (Index("uq_rtn_comment_reaction_identity", "comment_id", "visitor_key", unique=True),)

    def __str__(self) -> str:
        return f"RtnCommentReaction #{self.id} ({self.value})"
