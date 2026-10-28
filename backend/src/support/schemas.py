from datetime import datetime
from typing import Literal

from fastapi import UploadFile
from pydantic import BaseModel, Field

from src.support.models import MessageAuthor, Ticket, TicketCategory, TicketMessage, TicketStatus


class CreateTicketRequest(BaseModel):
    """Новое обращение: тема, категория, первое сообщение и файлы."""

    subject: str = Field(min_length=1, max_length=200)
    category: TicketCategory
    message: str = Field(min_length=1, max_length=5000)
    files: list[UploadFile] = Field(default_factory=list)


class ReplyToTicketRequest(BaseModel):
    """Ответ в обращение. Текст можно не писать, если приложены файлы."""

    text: str = Field(default="", max_length=5000)
    files: list[UploadFile] = Field(default_factory=list)


class AttachmentResponse(BaseModel):
    """Приложенный файл: имя и адрес."""

    name: str
    url: str


class MessageResponse(BaseModel):
    """Сообщение в обращении от пользователя или поддержки."""

    id: int
    author: Literal["user", "support"]
    author_name: str
    text: str
    created_at: datetime
    attachments: list[AttachmentResponse]

    @classmethod
    def from_message(cls, message: TicketMessage) -> "MessageResponse":
        """Собирает ответ из сообщения. Поддержка подписана как support."""
        return cls(
            id=message.id,
            author="user" if message.author_kind == MessageAuthor.USER else "support",
            author_name=message.author_name,
            text=message.text,
            created_at=message.created_at,
            attachments=message.attachments,
        )


class TicketResponse(BaseModel):
    """Обращение в списке: без переписки, только начало последнего сообщения."""

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
    def from_ticket(cls, ticket: Ticket) -> "TicketResponse":
        """Собирает карточку обращения для списка."""
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


class TicketDetailResponse(TicketResponse):
    """Обращение со всей перепиской."""

    messages: list[MessageResponse]

    @classmethod
    def from_ticket(cls, ticket: Ticket) -> "TicketDetailResponse":
        """Собирает обращение вместе со всей перепиской."""
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
            messages=[MessageResponse.from_message(message) for message in ticket.messages],
        )


class TicketListResponse(BaseModel):
    """Страница обращений и есть ли следующая."""

    items: list[TicketResponse]
    has_more: bool
