"Use case: create response status changed notification."
from models.account import UserRole
from models.notification import Notification, NotificationType
from models.response import ResponseStatus
from schemas.notification import (
    ResponseStatusChangedNotificationPayload,
    ResponseStatusChangeReason,
)
from services.notifications.repository import NotificationRepository


class CreateResponseStatusChangedNotificationUseCase:
    "In-app уведомление о смене статуса отклика (заказчику или эксперту)."

    def __init__(self, repo: NotificationRepository) -> None:
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
        rejection_reason: str | None = None,
    ) -> Notification:
        "Запускает основной сценарий use case."
        payload = ResponseStatusChangedNotificationPayload(
            order_title=order_title,
            actor_role=actor_role,
            status_from=status_from,
            status_to=status_to,
            reason=reason,
            rejection_reason=rejection_reason,
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
