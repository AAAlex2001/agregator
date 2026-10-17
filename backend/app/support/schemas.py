"""Обращения в поддержку в ответах API."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

from app.support.models import (
    SupportTicket,
    SupportTicketMessage,
    TicketCategory,
    TicketMessageAuthor,
    TicketStatus,
)


class SupportTicketAttachmentSchema(BaseModel):
    """Файл, приложенный к сообщению."""

    name: str
    url: str


class SupportTicketMessageSchema(BaseModel):
    """Сообщение обращения от пользователя или поддержки."""

    id: int
    author: Literal["user", "support"]
    author_name: str
    text: str
    created_at: datetime
    attachments: list[SupportTicketAttachmentSchema]

    @classmethod
    def from_message(cls, message: SupportTicketMessage) -> "SupportTicketMessageSchema":
        """Сообщение для ответа: поддержка подписана как support."""

        is_user = message.author_kind == TicketMessageAuthor.USER

        return cls(
            id=message.id,
            author="user" if is_user else "support",
            author_name=message.author_name,
            text=message.text,
            created_at=message.created_at,
            attachments=message.attachments or [],
        )


class SupportTicketSummarySchema(BaseModel):
    """Обращение в списке: тема, статус и начало последнего сообщения."""

    id: int
    number: str
    subject: str
    category: TicketCategory
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    has_unread: bool
    last_message_preview: str

    @classmethod
    def from_ticket(cls, ticket: SupportTicket) -> "SupportTicketSummarySchema":
        """Карточка обращения для списка."""

        return cls(
            id=ticket.id,
            number=ticket.number,
            subject=ticket.subject,
            category=ticket.category,
            status=ticket.status,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
            has_unread=ticket.has_unread_for_user,
            last_message_preview=ticket.last_message_text[:160],
        )


class SupportTicketDetailSchema(SupportTicketSummarySchema):
    """Обращение со всей перепиской."""

    messages: list[SupportTicketMessageSchema]

    @classmethod
    def from_ticket(cls, ticket: SupportTicket) -> "SupportTicketDetailSchema":
        """Обращение и его сообщения по порядку отправки."""

        summary = SupportTicketSummarySchema.from_ticket(ticket)

        return cls(
            **summary.model_dump(),
            messages=[SupportTicketMessageSchema.from_message(item) for item in ticket.messages],
        )


class SupportTicketListSchema(BaseModel):
    """Страница обращений пользователя."""

    items: list[SupportTicketSummarySchema]
    has_more: bool

    @classmethod
    def from_tickets(cls, tickets: list[SupportTicket], limit: int) -> "SupportTicketListSchema":
        """Страница из limit обращений. Запрошено на одно больше: пришло — есть следующая."""

        return cls(
            items=[SupportTicketSummarySchema.from_ticket(ticket) for ticket in tickets[:limit]],
            has_more=len(tickets) > limit,
        )
