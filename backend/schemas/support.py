from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from models.support_ticket import TicketCategory, TicketStatus


class SupportTicketAttachment(BaseModel):
    "Вложение в сообщении тикета техподдержки."
    name: str
    url: str


class SupportTicketMessageItem(BaseModel):
    "Сообщение в тикете техподдержки (от пользователя или от саппорта)."
    id: int
    author: Literal["user", "support"]
    author_name: str
    text: str
    created_at: datetime
    attachments: list[SupportTicketAttachment] = []

    model_config = ConfigDict(from_attributes=True)


class SupportTicketSummary(BaseModel):
    "Краткая карточка тикета техподдержки для списка."
    id: int
    number: str
    subject: str
    category: TicketCategory
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    has_unread: bool = False
    last_message_preview: str = ""

    model_config = ConfigDict(from_attributes=True)


class SupportTicketDetail(SupportTicketSummary):
    "Карточка тикета техподдержки с полной перепиской."
    messages: list[SupportTicketMessageItem] = []


class SupportTicketList(BaseModel):
    "Постраничный список тикетов техподдержки пользователя."
    items: list[SupportTicketSummary]
    has_more: bool


class CreateTicketRequest(BaseModel):
    "Payload создания нового тикета техподдержки."
    subject: str = Field(..., min_length=1, max_length=200)
    category: TicketCategory
    message: str = Field(..., min_length=1, max_length=5000)


__all__ = [
    "SupportTicketAttachment",
    "SupportTicketMessageItem",
    "SupportTicketSummary",
    "SupportTicketDetail",
    "SupportTicketList",
    "CreateTicketRequest",
]
