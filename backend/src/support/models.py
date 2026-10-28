from datetime import datetime
from enum import StrEnum

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base import Base, utc_now


class TicketStatus(StrEnum):
    """Состояние обращения: ждёт ответа поддержки, отвечено или закрыто."""

    REVIEW = "REVIEW"
    ANSWERED = "ANSWERED"
    CLOSED = "CLOSED"


class TicketCategory(StrEnum):
    """Тема обращения, которую выбирает пользователь."""

    ORDER = "ORDER"
    RESPONSE = "RESPONSE"
    TECHNICAL = "TECHNICAL"
    BILLING = "BILLING"
    ACCOUNT = "ACCOUNT"
    COMPLAINT = "COMPLAINT"
    SUGGESTION = "SUGGESTION"
    OTHER = "OTHER"


class MessageAuthor(StrEnum):
    """Кто написал сообщение: пользователь или поддержка."""

    USER = "USER"
    ADMIN = "ADMIN"


class Ticket(Base):
    """Обращение пользователя в поддержку."""

    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(20), unique=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    subject: Mapped[str] = mapped_column(String(200))
    category: Mapped[TicketCategory] = mapped_column(Enum(TicketCategory, name="ticketcategory"))
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus, name="ticketstatus"),
        default=TicketStatus.REVIEW,
    )
    has_unread_for_user: Mapped[bool] = mapped_column(default=False)
    has_unread_for_admin: Mapped[bool] = mapped_column(default=True)
    last_message_text: Mapped[str] = mapped_column(Text, default="")
    last_message_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    messages: Mapped[list["TicketMessage"]] = relationship(
        lazy="selectin",
        order_by="TicketMessage.created_at",
    )


class TicketMessage(Base):
    """Сообщение в обращении от пользователя или от поддержки."""

    __tablename__ = "support_ticket_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("support_tickets.id", ondelete="CASCADE"))
    author_kind: Mapped[MessageAuthor] = mapped_column(Enum(MessageAuthor, name="ticketmessageauthor"))
    author_user_id: Mapped[int | None] = mapped_column(ForeignKey("accounts.id", ondelete="SET NULL"))
    author_name: Mapped[str] = mapped_column(String(200), default="")
    text: Mapped[str] = mapped_column(Text, default="")
    attachments: Mapped[list[dict[str, str]]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
