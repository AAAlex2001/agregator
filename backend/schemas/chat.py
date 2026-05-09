from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from models.chat import ExpertRoomMessage
from services.email.formatting import full_name


class ChatAttachmentResponse(BaseModel):
    url: str
    name: str


class ChatAttachmentData(BaseModel):
    "Вложение чата после сохранения на диск (внутренняя модель между FileStorage и use case)."
    url: str
    name: str


class ChatOpenRequest(BaseModel):
    order_id: int = Field(..., ge=1)


class ChatSendMessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class ChatMessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    sender_role: str
    text: str
    file_url: str | None = None
    file_name: str | None = None
    attachments: list[ChatAttachmentResponse] = Field(default_factory=list)
    is_read: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatBadgeResponse(BaseModel):
    text: str
    variant: str


class ChatListItemResponse(BaseModel):
    id: int
    uuid: str
    order_id: int
    counterpart_id: int
    counterpart_name: str
    counterpart_avatar_url: str | None = None
    last_message_text: str = ""
    last_message_sender_id: int | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0
    updated_at: datetime


class ChatListResponse(BaseModel):
    items: list[ChatListItemResponse]
    total: int


class ChatDetailResponse(BaseModel):
    id: int
    uuid: str
    order_id: int
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
    chat_id: int
    online_user_ids: list[int]
    both_online: bool


class ExpertRoomMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    sender_name: str
    sender_avatar_url: str | None
    text: str
    created_at: datetime

    @classmethod
    def from_db(cls, message: ExpertRoomMessage) -> "ExpertRoomMessageOut":
        sender = message.sender
        name = full_name(sender) or (sender.email if sender else None) or f"id:{message.sender_id}"
        return cls(
            id=message.id,
            sender_id=message.sender_id,
            sender_name=name,
            sender_avatar_url=sender.avatar_url if sender else None,
            text=message.text,
            created_at=message.created_at,
        )


class ExpertRoomHistoryResponse(BaseModel):
    items: list[ExpertRoomMessageOut]
    has_more: bool
    banned: bool = False
    ban_reason: str | None = None


class SendExpertRoomMessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


class ExpertRoomTypingPayload(BaseModel):
    user_id: int
    user_name: str


class WsExpertRoomMessage(BaseModel):
    event: Literal["expert_room_message"] = "expert_room_message"
    data: ExpertRoomMessageOut


class WsExpertRoomTyping(BaseModel):
    event: Literal["expert_room_typing"] = "expert_room_typing"
    data: ExpertRoomTypingPayload
