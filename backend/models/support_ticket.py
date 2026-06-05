from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.user import User


class TicketStatus(str, PyEnum):
    REVIEW = "REVIEW"
    ANSWERED = "ANSWERED"
    CLOSED = "CLOSED"


class TicketCategory(str, PyEnum):
    ORDER = "ORDER"
    RESPONSE = "RESPONSE"
    TECHNICAL = "TECHNICAL"
    BILLING = "BILLING"
    ACCOUNT = "ACCOUNT"
    COMPLAINT = "COMPLAINT"
    SUGGESTION = "SUGGESTION"
    OTHER = "OTHER"


class TicketMessageAuthor(str, PyEnum):
    USER = "USER"
    ADMIN = "ADMIN"


class SupportTicket(Base):
    """Тикет поддержки."""
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    number: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[TicketCategory] = mapped_column(
        Enum(TicketCategory, name="ticketcategory"),
        nullable=False,
        index=True,
    )
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus, name="ticketstatus"),
        nullable=False,
        default=TicketStatus.REVIEW,
        index=True,
    )
    has_unread_for_user: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    has_unread_for_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    last_message_text: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    last_message_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="support_tickets",
        passive_deletes=True,
    )
    messages: Mapped[list["SupportTicketMessage"]] = relationship(
        back_populates="ticket",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="SupportTicketMessage.created_at",
    )


class SupportTicketMessage(Base):
    """Сообщение в тикете поддержки."""
    __tablename__ = "support_ticket_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    ticket_id: Mapped[int] = mapped_column(
        ForeignKey("support_tickets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_kind: Mapped[TicketMessageAuthor] = mapped_column(
        Enum(TicketMessageAuthor, name="ticketmessageauthor"),
        nullable=False,
    )
    author_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    author_name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    attachments: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    ticket: Mapped["SupportTicket"] = relationship(back_populates="messages")
