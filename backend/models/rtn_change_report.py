from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class RtnChangeReportStatus(str, PyEnum):
    "Статус обработки сообщения об устаревшем разъяснении."
    NEW = "NEW"
    REVIEWED = "REVIEWED"
    APPLIED = "APPLIED"


class RtnChangeReport(Base):
    "Сообщение пользователя о том, что разъяснение устарело или изменилось."
    __tablename__ = "rtn_change_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    clarification_id: Mapped[int] = mapped_column(
        ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True, index=True
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[RtnChangeReportStatus] = mapped_column(
        Enum(RtnChangeReportStatus, name="rtn_change_report_status"),
        nullable=False,
        default=RtnChangeReportStatus.NEW,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    def __str__(self) -> str:
        return f"RtnChangeReport #{self.id}"
