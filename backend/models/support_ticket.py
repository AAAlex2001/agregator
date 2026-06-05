from datetime import UTC, datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from models.base import Base


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
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(20), nullable=False, unique=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subject = Column(String(200), nullable=False)
    category = Column(
        Enum(TicketCategory, name="ticketcategory"),
        nullable=False,
        index=True,
    )
    status = Column(
        Enum(TicketStatus, name="ticketstatus"),
        nullable=False,
        default=TicketStatus.REVIEW,
        index=True,
    )
    has_unread_for_user = Column(Boolean, nullable=False, default=False, server_default="false")
    has_unread_for_admin = Column(Boolean, nullable=False, default=True, server_default="true")
    last_message_text = Column(Text, nullable=False, default="", server_default="")
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="support_tickets",
        passive_deletes=True,
    )
    messages = relationship(
        "SupportTicketMessage",
        back_populates="ticket",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="SupportTicketMessage.created_at",
    )


class SupportTicketMessage(Base):
    __tablename__ = "support_ticket_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(
        Integer,
        ForeignKey("support_tickets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_kind = Column(
        Enum(TicketMessageAuthor, name="ticketmessageauthor"),
        nullable=False,
    )
    author_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    author_name = Column(String(200), nullable=False, default="")
    text = Column(Text, nullable=False, default="")
    attachments = Column(JSON, nullable=False, default=list)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    ticket = relationship("SupportTicket", back_populates="messages")
