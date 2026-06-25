from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class ReactionValue(str, PyEnum):
    LIKE = "LIKE"
    DISLIKE = "DISLIKE"


class ArticleReaction(Base):
    "Оценка статьи пользователем: одна на пару (статья, пользователь), её можно сменить или убрать."
    __tablename__ = "article_reactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    article_id: Mapped[int] = mapped_column(
        ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    value: Mapped[ReactionValue] = mapped_column(Enum(ReactionValue, name="reactionvalue"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("article_id", "user_id", name="uq_article_reaction_user"),
    )

    def __str__(self) -> str:
        return f"Reaction #{self.id} ({self.value})"
