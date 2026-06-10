from datetime import UTC, datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class Company(Base):
    "Компания из загруженной базы (ЕГРЮЛ-дамп). Переиспользуемая база для email-рассылок."
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    inn: Mapped[str] = mapped_column(String(12), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    full_name: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    kpp: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ogrn: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True, index=True)
    region: Mapped[str | None] = mapped_column(String(200), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    okved_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    okved_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    # Когда компании ушло письмо рассылки. NULL — ещё не слали (попадёт в следующую пачку).
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False
    )

    def __str__(self) -> str:
        return f"{self.name} ({self.inn})"
