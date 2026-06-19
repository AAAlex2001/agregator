from datetime import UTC, datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class EmailSuppression(Base):
    "Глобальный стоп-лист адресов: отписки и жалобы. Любая рассылка обязана исключать эти адреса."
    __tablename__ = "email_suppressions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    reason: Mapped[str] = mapped_column(String(50), nullable=False, default="unsubscribe")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    def __str__(self) -> str:
        return f"{self.email} ({self.reason})"
