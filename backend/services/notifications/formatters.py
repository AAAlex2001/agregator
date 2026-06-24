"Форматирование сущностей в API-структуры."
from models.notification import Notification, NotificationType
from schemas.notification import (
    ChatMessageNotificationItemResponse,
    ChatMessageNotificationPayload,
    NewBlogPostNotificationItemResponse,
    NewBlogPostNotificationPayload,
    NewOrderNotificationItemResponse,
    NewOrderNotificationPayload,
    NotificationItemResponse,
    QuestionAnsweredNotificationItemResponse,
    QuestionAnsweredNotificationPayload,
    QuestionAskedNotificationItemResponse,
    QuestionAskedNotificationPayload,
    ResponseStatusChangedNotificationItemResponse,
    ResponseStatusChangedNotificationPayload,
    ResponseUpdatedNotificationItemResponse,
    ResponseUpdatedNotificationPayload,
    SupportReplyNotificationItemResponse,
    SupportReplyNotificationPayload,
)


def to_response(notification: Notification) -> NotificationItemResponse:
    "Маппит ORM-уведомление в дискриминированный union Pydantic-схемы по type."
    common = {
        "id": notification.id,
        "action_url": notification.action_url,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
        "read_at": notification.read_at,
    }
    payload = notification.payload or {}

    if notification.type == NotificationType.RESPONSE_UPDATED:
        return ResponseUpdatedNotificationItemResponse(
            type=NotificationType.RESPONSE_UPDATED,
            payload=ResponseUpdatedNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.RESPONSE_STATUS_CHANGED:
        return ResponseStatusChangedNotificationItemResponse(
            type=NotificationType.RESPONSE_STATUS_CHANGED,
            payload=ResponseStatusChangedNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.CHAT_MESSAGE:
        return ChatMessageNotificationItemResponse(
            type=NotificationType.CHAT_MESSAGE,
            payload=ChatMessageNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.QUESTION_ASKED:
        return QuestionAskedNotificationItemResponse(
            type=NotificationType.QUESTION_ASKED,
            payload=QuestionAskedNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.QUESTION_ANSWERED:
        return QuestionAnsweredNotificationItemResponse(
            type=NotificationType.QUESTION_ANSWERED,
            payload=QuestionAnsweredNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.SUPPORT_REPLY:
        return SupportReplyNotificationItemResponse(
            type=NotificationType.SUPPORT_REPLY,
            payload=SupportReplyNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.NEW_BLOG_POST:
        return NewBlogPostNotificationItemResponse(
            type=NotificationType.NEW_BLOG_POST,
            payload=NewBlogPostNotificationPayload.model_validate(payload),
            **common,
        )

    if notification.type == NotificationType.NEW_ORDER:
        return NewOrderNotificationItemResponse(
            type=NotificationType.NEW_ORDER,
            payload=NewOrderNotificationPayload.model_validate(payload),
            **common,
        )

    raise ValueError(f"Unsupported notification type: {notification.type}")
