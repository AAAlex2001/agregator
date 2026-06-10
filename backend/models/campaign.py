from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import (
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
    "Статус email-кампании."
    DRAFT = "DRAFT"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    DONE = "DONE"
    FAILED = "FAILED"


class RecipientStatus(str, PyEnum):
    "Статус доставки письма конкретному получателю."
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    BOUNCED = "BOUNCED"
    UNSUBSCRIBED = "UNSUBSCRIBED"


class SuppressionReason(str, PyEnum):
    "Причина попадания адреса в стоп-лист."
    UNSUBSCRIBE = "UNSUBSCRIBE"
    BOUNCE = "BOUNCE"
    COMPLAINT = "COMPLAINT"
    MANUAL = "MANUAL"


class EmailCampaign(Base):
    "Email-кампания: тема, шаблон и параметры рассылки. Получатели — в campaign_recipients."
    __tablename__ = "email_campaigns"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    subject: Mapped[str] = mapped_column(String(300), nullable=False)
    presentation_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[CampaignStatus] = mapped_column(
        Enum(CampaignStatus, name="campaignstatus"),
        nullable=False,
        default=CampaignStatus.DRAFT,
        index=True,
    )
    batch_size: Mapped[int] = mapped_column(Integer, nullable=False, default=100, server_default="100")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    recipients: Mapped[list["CampaignRecipient"]] = relationship(
        back_populates="campaign",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __str__(self) -> str:
        return f"#{self.id} {self.name}"


class CampaignRecipient(Base):
    "Один получатель кампании: компания + один email + статус доставки."
    __tablename__ = "campaign_recipients"
    __table_args__ = (
        UniqueConstraint("campaign_id", "email", name="uq_campaign_recipient_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(
        ForeignKey("email_campaigns.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    company_name: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    inn: Mapped[str | None] = mapped_column(String(12), nullable=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    status: Mapped[RecipientStatus] = mapped_column(
        Enum(RecipientStatus, name="recipientstatus"),
        nullable=False,
        default=RecipientStatus.PENDING,
        index=True,
    )
    is_seed: Mapped[bool] = mapped_column(default=False, nullable=False, server_default="false")
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    campaign: Mapped["EmailCampaign"] = relationship(back_populates="recipients")

    def __str__(self) -> str:
        return f"{self.email} [{self.status.value}]"


class EmailSuppression(Base):
    "Глобальный стоп-лист: адреса, которым нельзя слать (отписка/баунс/жалоба)."
    __tablename__ = "email_suppression"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    reason: Mapped[SuppressionReason] = mapped_column(
        Enum(SuppressionReason, name="suppressionreason"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    def __str__(self) -> str:
        return self.email
