from models.notification import Notification, NotificationType
from models.response import ResponseStatus
from models.user import UserRole
from schemas.notification import (
    ResponseStatusChangeReason,
    ResponseStatusChangedNotificationPayload,
)
from services.notifications.repository import NotificationRepository


class CreateResponseStatusChangedNotificationUseCase:
    "In-app уведомление о смене статуса отклика (заказчику или эксперту)."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(
        self,
        user_id: int,
        order_title: str,
        actor_role: UserRole,
        status_from: ResponseStatus,
        status_to: ResponseStatus,
        reason: ResponseStatusChangeReason,
        action_url: str | None = None,
    ) -> Notification:
        payload = ResponseStatusChangedNotificationPayload(
            order_title=order_title,
            actor_role=actor_role,
            status_from=status_from,
            status_to=status_to,
            reason=reason,
        )
        notification = Notification(
            user_id=user_id,
            type=NotificationType.RESPONSE_STATUS_CHANGED,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(user_id)
        await self.repo.flush()
        return notification
