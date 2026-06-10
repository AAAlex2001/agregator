from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class CampaignStatus(str, PyEnum):
    DRAFT = "DRAFT"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    DONE = "DONE"
    FAILED = "FAILED"

    def __str__(self) -> str:
        labels = {
            "DRAFT": "Черновик",
            "RUNNING": "Идёт рассылка",
            "PAUSED": "На паузе",
            "DONE": "Завершена",
            "FAILED": "Ошибка",
        }
        return labels.get(self.value, self.value)


class RecipientStatus(str, PyEnum):
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    BOUNCED = "BOUNCED"
    UNSUBSCRIBED = "UNSUBSCRIBED"

    def __str__(self) -> str:
        labels = {
            "PENDING": "В очереди",
            "SENT": "Отправлено",
            "FAILED": "Ошибка",
            "BOUNCED": "Не доставлено",
            "UNSUBSCRIBED": "Отписан",
        }
        return labels.get(self.value, self.value)


class SuppressionReason(str, PyEnum):
    UNSUBSCRIBE = "UNSUBSCRIBE"
    BOUNCE = "BOUNCE"
    COMPLAINT = "COMPLAINT"
    MANUAL = "MANUAL"

    def __str__(self) -> str:
        labels = {
            "UNSUBSCRIBE": "Отписка",
            "BOUNCE": "Не доставлено",
            "COMPLAINT": "Жалоба",
            "MANUAL": "Вручную",
        }
        return labels.get(self.value, self.value)


class EmailCampaign(Base):
    "Email-кампания: тема, параметры рассылки. Получатели — в campaign_recipients."
    __tablename__ = "email_campaigns"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    subject: Mapped[str] = mapped_column(String(300), nullable=False)
    presentation_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[CampaignStatus] = mapped_column(
        Enum(CampaignStatus, name="campaignstatus"), nullable=False, default=CampaignStatus.DRAFT, index=True
    )
    batch_size: Mapped[int] = mapped_column(Integer, nullable=False, default=100, server_default="100")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    recipients: Mapped[list["CampaignRecipient"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan", passive_deletes=True
    )

    def __str__(self) -> str:
        return f"#{self.id} {self.name}"


class CampaignRecipient(Base):
    "Один получатель кампании: компания + email + статус доставки."
    __tablename__ = "campaign_recipients"
    __table_args__ = (
        UniqueConstraint("campaign_id", "email", name="uq_campaign_recipient_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("email_campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    inn: Mapped[str | None] = mapped_column(String(12), nullable=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    status: Mapped[RecipientStatus] = mapped_column(
        Enum(RecipientStatus, name="recipientstatus"), nullable=False, default=RecipientStatus.PENDING, index=True
    )
    is_seed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    campaign: Mapped["EmailCampaign"] = relationship(back_populates="recipients")

    def __str__(self) -> str:
        return f"{self.email} [{self.status}]"


class EmailSuppression(Base):
    "Глобальный стоп-лист: адреса, которым нельзя слать."
    __tablename__ = "email_suppression"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    reason: Mapped[SuppressionReason] = mapped_column(Enum(SuppressionReason, name="suppressionreason"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    def __str__(self) -> str:
        return self.email
