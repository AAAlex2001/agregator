from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class RtnClarificationReaction(Base):
    __tablename__ = "rtn_clarification_reactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    clarification_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("rtn_clarifications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(10), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        Index(
            "uq_rtn_clarification_reaction_identity",
            "clarification_id",
            "visitor_key",
            unique=True,
        ),
    )
