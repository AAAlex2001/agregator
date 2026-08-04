from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from models.chat import ExpertRoomMessage
from models.labor import LaborListingKind
from services.email.formatting import full_name


class ChatAttachmentData(BaseModel):
    "Вложение чата (имя + url) — и в ответах API, и между FileStorage и use case."
    url: str
    name: str


class ChatOpenRequest(BaseModel):
    "Запрос на открытие/получение чата по заказу. expert_id — чат заказчика с конкретным экспертом."
    order_id: int = Field(..., ge=1)
    expert_id: int | None = Field(None, ge=1)


class ChatMessageResponse(BaseModel):
    "Сообщение чата заказа в ответе API."
    model_config = ConfigDict(from_attributes=True)

    id: int
    chat_id: int
    sender_id: int
    sender_role: str
    text: str
    file_url: str | None = None
    file_name: str | None = None
    attachments: list[ChatAttachmentData] = Field(default_factory=list)
    is_read: bool = False
    created_at: datetime


class ChatBadgeResponse(BaseModel):
    "Бейдж заказа в карточке чата."
    text: str
    variant: str


class ChatListItemResponse(BaseModel):
    "Карточка чата в списке для бокового меню."
    id: int
    uuid: str
    order_id: int | None = None
    labor_listing_id: int | None = None
    labor_listing_kind: LaborListingKind | None = None
    labor_listing_is_mine: bool | None = None
    contact_deal_id: int | None = None
    counterpart_id: int
    counterpart_name: str
    counterpart_avatar_url: str | None = None
    last_message_text: str = ""
    last_message_sender_id: int | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0
    is_blocked: bool = False
    updated_at: datetime


class ChatListResponse(BaseModel):
    "Список чатов пользователя с общим счётчиком."
    items: list[ChatListItemResponse]
    total: int


class ChatDetailResponse(BaseModel):
    "Полная карточка чата: данные заказа, контрагент и история сообщений."
    id: int
    uuid: str
    order_id: int | None = None
    order_public_id: str
    customer_id: int
    expert_id: int
    order_title: str
    order_company: str
    order_date: str
    order_sum: str
    order_badges: list[ChatBadgeResponse]
    counterpart_id: int
    counterpart_name: str
    counterpart_avatar_url: str | None = None
    response_status: str | None = None
    is_blocked: bool = False
    is_manually_blocked: bool = False
    messages: list[ChatMessageResponse]


class ChatPresenceResponse(BaseModel):
    "Статус присутствия участников чата (кто онлайн сейчас)."
    chat_id: int
    online_user_ids: list[int]
    both_online: bool


class ExpertRoomMessageOut(BaseModel):
    "Сообщение общего чата экспертов в ответе API."
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    sender_name: str
    sender_avatar_url: str | None
    text: str
    attachments: list[ChatAttachmentData] = Field(default_factory=list)
    created_at: datetime

    @classmethod
    def from_db(cls, message: ExpertRoomMessage) -> "ExpertRoomMessageOut":
        sender = message.sender
        name = full_name(sender) or (sender.email if sender else None) or f"id:{message.sender_id}"
        raw_attachments = list(message.attachments or [])
        attachments = [
            ChatAttachmentData.model_validate(item) if not isinstance(item, ChatAttachmentData) else item
            for item in raw_attachments
        ]
        return cls(
            id=message.id,
            sender_id=message.sender_id,
            sender_name=name,
            sender_avatar_url=sender.avatar_url if sender else None,
            text=message.text,
            attachments=attachments,
            created_at=message.created_at,
        )


class ExpertRoomHistoryResponse(BaseModel):
    "Постраничная история сообщений общего чата экспертов."
    items: list[ExpertRoomMessageOut]
    has_more: bool
    banned: bool = False
    ban_reason: str | None = None


class ExpertRoomTypingPayload(BaseModel):
    "Сигнал «печатает» для общего чата экспертов."
    user_id: int
    user_name: str


class WsExpertRoomMessage(BaseModel):
    "WebSocket-событие нового сообщения в общем чате экспертов."
    event: Literal["expert_room_message"] = "expert_room_message"
    data: ExpertRoomMessageOut


class WsExpertRoomTyping(BaseModel):
    "WebSocket-событие «печатает» в общем чате экспертов."
    event: Literal["expert_room_typing"] = "expert_room_typing"
    data: ExpertRoomTypingPayload
