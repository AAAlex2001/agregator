from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from models.support_ticket import TicketCategory, TicketMessageAuthor, TicketStatus


class SupportTicketAttachment(BaseModel):
    name: str
    url: str


class SupportTicketMessageItem(BaseModel):
    id: int
    author: Literal["user", "support"]
    author_name: str
    text: str
    created_at: datetime
    attachments: list[SupportTicketAttachment] = []

    model_config = {"from_attributes": True}


class SupportTicketSummary(BaseModel):
    id: int
    number: str
    subject: str
    category: TicketCategory
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    has_unread: bool = False
    last_message_preview: str = ""

    model_config = {"from_attributes": True}


class SupportTicketDetail(SupportTicketSummary):
    messages: list[SupportTicketMessageItem] = []


class SupportTicketList(BaseModel):
    items: list[SupportTicketSummary]
    total: int


class CreateTicketRequest(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200)
    category: TicketCategory
    message: str = Field(..., min_length=1, max_length=5000)


class ReplyTicketRequest(BaseModel):
    text: str = Field(default="", max_length=5000)


__all__ = [
    "TicketCategory",
    "TicketStatus",
    "TicketMessageAuthor",
    "SupportTicketAttachment",
    "SupportTicketMessageItem",
    "SupportTicketSummary",
    "SupportTicketDetail",
    "SupportTicketList",
    "CreateTicketRequest",
    "ReplyTicketRequest",
]
