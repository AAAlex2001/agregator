from datetime import datetime
from enum import Enum as PyEnum
from typing import Annotated, Literal

from pydantic import BaseModel, Field

from models.notification import NotificationType
from models.response import ResponseStatus
from models.user import UserRole


class ResponseStatusChangeReason(str, PyEnum):
    "Причина смены статуса отклика для уведомлений."
    DIRECT_CHANGE = "DIRECT_CHANGE"
    SELECTED_ANOTHER = "SELECTED_ANOTHER"
    SELECTED_ANOTHER_REVERTED = "SELECTED_ANOTHER_REVERTED"


class ResponseUpdateKind(str, PyEnum):
    "Тип обновления отклика в уведомлении (создан / изменён / отозван)."
    CREATED = "CREATED"
    UPDATED = "UPDATED"
    WITHDRAWN = "WITHDRAWN"


class NotificationPayloadModel(BaseModel):
    "Базовый payload уведомления с запретом лишних полей."
    model_config = {"extra": "forbid"}


class ResponseUpdatedNotificationPayload(NotificationPayloadModel):
    "Payload уведомления об изменении отклика по заказу."
    order_title: str
    kind: ResponseUpdateKind = ResponseUpdateKind.UPDATED


class ResponseStatusChangedNotificationPayload(NotificationPayloadModel):
    "Payload уведомления о смене статуса отклика."
    order_title: str
    actor_role: UserRole
    status_from: ResponseStatus
    status_to: ResponseStatus
    reason: ResponseStatusChangeReason
    rejection_reason: str | None = None


class ChatMessageNotificationPayload(NotificationPayloadModel):
    "Payload уведомления о новом сообщении в чате заказа."
    order_title: str
    sender_role: UserRole
    preview: str


class QuestionAskedNotificationPayload(NotificationPayloadModel):
    "Payload уведомления о новом вопросе эксперта по заказу."
    order_title: str
    expert_name: str
    preview: str


class QuestionAnsweredNotificationPayload(NotificationPayloadModel):
    "Payload уведомления об ответе на вопрос эксперта."
    order_title: str
    preview: str


class SupportReplyNotificationPayload(NotificationPayloadModel):
    "Payload уведомления об ответе техподдержки по тикету."
    ticket_number: str
    subject: str
    preview: str


class NotificationItemBaseResponse(BaseModel):
    "Базовая карточка уведомления (общие поля для всех типов)."
    id: int
    action_url: str | None = None
    is_read: bool
    created_at: datetime
    read_at: datetime | None = None


class ResponseUpdatedNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление об изменении отклика."
    type: Literal[NotificationType.RESPONSE_UPDATED]
    payload: ResponseUpdatedNotificationPayload


class ResponseStatusChangedNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление о смене статуса отклика."
    type: Literal[NotificationType.RESPONSE_STATUS_CHANGED]
    payload: ResponseStatusChangedNotificationPayload


class ChatMessageNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление о новом сообщении в чате заказа."
    type: Literal[NotificationType.CHAT_MESSAGE]
    payload: ChatMessageNotificationPayload


class QuestionAskedNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление о заданном вопросе по заказу."
    type: Literal[NotificationType.QUESTION_ASKED]
    payload: QuestionAskedNotificationPayload


class QuestionAnsweredNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление об ответе на ранее заданный вопрос."
    type: Literal[NotificationType.QUESTION_ANSWERED]
    payload: QuestionAnsweredNotificationPayload


class SupportReplyNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление об ответе техподдержки в тикете."
    type: Literal[NotificationType.SUPPORT_REPLY]
    payload: SupportReplyNotificationPayload


class NewBlogPostNotificationPayload(NotificationPayloadModel):
    "Payload уведомления о новой публикации в блоге."
    blog_title: str
    preview: str


class NewBlogPostNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление о новой публикации в блоге."
    type: Literal[NotificationType.NEW_BLOG_POST]
    payload: NewBlogPostNotificationPayload


class NewOrderNotificationPayload(NotificationPayloadModel):
    "Payload уведомления о новой заявке, попавшей в фильтр эксперта по типам."
    order_title: str
    badges: list[str] = Field(default_factory=list)
    message: str = ""


class NewOrderNotificationItemResponse(NotificationItemBaseResponse):
    "Уведомление о новой заявке по типам, на которые подписан эксперт."
    type: Literal[NotificationType.NEW_ORDER]
    payload: NewOrderNotificationPayload


NotificationItemResponse = Annotated[
    ResponseUpdatedNotificationItemResponse
    | ResponseStatusChangedNotificationItemResponse
    | ChatMessageNotificationItemResponse
    | QuestionAskedNotificationItemResponse
    | QuestionAnsweredNotificationItemResponse
    | NewBlogPostNotificationItemResponse
    | NewOrderNotificationItemResponse
    | SupportReplyNotificationItemResponse,
    Field(discriminator="type"),
]


class NotificationListResponse(BaseModel):
    "Постраничный список уведомлений со счётчиком непрочитанных."
    items: list[NotificationItemResponse]
    has_more: bool
    unread_count: int


class NotificationMutationResponse(BaseModel):
    "Ответ на пометку уведомлений прочитанными: новый счётчик и опционально обновлённая карточка."
    unread_count: int
    updated: int = 0
    item: NotificationItemResponse | None = None
