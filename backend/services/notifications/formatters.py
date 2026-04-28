from models.notification import Notification, NotificationType
from schemas.notification import (
    ChatMessageNotificationItemResponse,
    ChatMessageNotificationPayload,
    NotificationItemResponse,
    ResponseStatusChangedNotificationItemResponse,
    ResponseStatusChangedNotificationPayload,
    ResponseUpdatedNotificationItemResponse,
    ResponseUpdatedNotificationPayload,
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

    raise ValueError(f"Unsupported notification type: {notification.type}")
