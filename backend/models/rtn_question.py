from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class RtnQuestionStatus(str, PyEnum):
    "Статус обработки вопроса, заданного через форму «Не нашли ответ?»."
    NEW = "NEW"
    PUBLISHED = "PUBLISHED"
    DISMISSED = "DISMISSED"


class RtnQuestion(Base):
    "Вопрос, заданный посетителем через форму «Не нашли ответ?»."
    __tablename__ = "rtn_questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    visitor_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    question_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[RtnQuestionStatus] = mapped_column(
        Enum(RtnQuestionStatus, name="rtn_question_status"),
        nullable=False,
        default=RtnQuestionStatus.NEW,
        index=True,
    )
    answered_clarification_id: Mapped[int | None] = mapped_column(
        ForeignKey("rtn_clarifications.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    def __str__(self) -> str:
        return f"RtnQuestion #{self.id}"
