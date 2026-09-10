from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class RtnQuestionSubscription(Base):
    "Подписка на публикацию официального ответа: письмо уходит один раз, notified_at защищает от повторов."
    __tablename__ = "rtn_question_subscriptions"
    __table_args__ = (UniqueConstraint("question_id", "email", name="uq_rtn_question_subscription"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    question_id: Mapped[int] = mapped_column(
        ForeignKey("rtn_questions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True, index=True
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def __str__(self) -> str:
        return f"RtnQuestionSubscription #{self.id}"
