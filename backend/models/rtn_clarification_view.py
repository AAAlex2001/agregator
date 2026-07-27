from datetime import UTC, date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class RtnClarificationView(Base):
    __tablename__ = "rtn_clarification_views"

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
    viewed_on: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    __table_args__ = (
        Index(
            "uq_rtn_clarification_view_daily",
            "clarification_id",
            "visitor_key",
            "viewed_on",
            unique=True,
        ),
    )
