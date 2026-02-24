from datetime import datetime

from pydantic import BaseModel, Field


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
    messages: list[ChatMessageResponse]


class ChatPresenceResponse(BaseModel):
    chat_id: int
    online_user_ids: list[int]
    both_online: bool
