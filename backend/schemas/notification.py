from datetime import datetime
from enum import Enum as PyEnum
from typing import Annotated, Literal

from pydantic import BaseModel, Field
from models.notification import NotificationType
from models.response import ResponseStatus
from models.user import UserRole


class ResponseStatusChangeReason(str, PyEnum):
    DIRECT_CHANGE = "DIRECT_CHANGE"
    SELECTED_ANOTHER = "SELECTED_ANOTHER"
    SELECTED_ANOTHER_REVERTED = "SELECTED_ANOTHER_REVERTED"


class ResponseUpdateKind(str, PyEnum):
    CREATED = "CREATED"
    UPDATED = "UPDATED"
    WITHDRAWN = "WITHDRAWN"


class NotificationPayloadModel(BaseModel):
    model_config = {"extra": "forbid"}


class ResponseUpdatedNotificationPayload(NotificationPayloadModel):
    order_title: str
    kind: ResponseUpdateKind = ResponseUpdateKind.UPDATED


class ResponseStatusChangedNotificationPayload(NotificationPayloadModel):
    order_title: str
    actor_role: UserRole
    status_from: ResponseStatus
    status_to: ResponseStatus
    reason: ResponseStatusChangeReason


class ChatMessageNotificationPayload(NotificationPayloadModel):
    order_title: str
    sender_role: UserRole
    preview: str


class QuestionAskedNotificationPayload(NotificationPayloadModel):
    order_title: str
    expert_name: str
    preview: str


class QuestionAnsweredNotificationPayload(NotificationPayloadModel):
    order_title: str
    preview: str


class NotificationItemBaseResponse(BaseModel):
    id: int
    action_url: str | None = None
    is_read: bool
    created_at: datetime
    read_at: datetime | None = None


class ResponseUpdatedNotificationItemResponse(NotificationItemBaseResponse):
    type: Literal[NotificationType.RESPONSE_UPDATED]
    payload: ResponseUpdatedNotificationPayload


class ResponseStatusChangedNotificationItemResponse(NotificationItemBaseResponse):
    type: Literal[NotificationType.RESPONSE_STATUS_CHANGED]
    payload: ResponseStatusChangedNotificationPayload


class ChatMessageNotificationItemResponse(NotificationItemBaseResponse):
    type: Literal[NotificationType.CHAT_MESSAGE]
    payload: ChatMessageNotificationPayload


class QuestionAskedNotificationItemResponse(NotificationItemBaseResponse):
    type: Literal[NotificationType.QUESTION_ASKED]
    payload: QuestionAskedNotificationPayload


class QuestionAnsweredNotificationItemResponse(NotificationItemBaseResponse):
    type: Literal[NotificationType.QUESTION_ANSWERED]
    payload: QuestionAnsweredNotificationPayload


NotificationItemResponse = Annotated[
    ResponseUpdatedNotificationItemResponse
    | ResponseStatusChangedNotificationItemResponse
    | ChatMessageNotificationItemResponse
    | QuestionAskedNotificationItemResponse
    | QuestionAnsweredNotificationItemResponse,
    Field(discriminator="type"),
]


class NotificationListResponse(BaseModel):
    items: list[NotificationItemResponse]
    total: int
    unread_count: int


class NotificationMutationResponse(BaseModel):
    unread_count: int
    updated: int = 0
    item: NotificationItemResponse | None = None