"Use case: create response updated notification."
from models.notification import Notification, NotificationType
from schemas.notification import ResponseUpdatedNotificationPayload, ResponseUpdateKind
from services.notifications.repository import NotificationRepository


class CreateResponseUpdatedNotificationUseCase:
    "In-app уведомление заказчику о новом/обновлённом/отозванном отклике."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        user_id: int,
        order_title: str,
        kind: ResponseUpdateKind = ResponseUpdateKind.UPDATED,
        action_url: str | None = None,
    ) -> Notification:
        "Запускает основной сценарий use case."
        payload = ResponseUpdatedNotificationPayload(order_title=order_title, kind=kind)
        notification = Notification(
            user_id=user_id,
            type=NotificationType.RESPONSE_UPDATED,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(user_id)
        await self.repo.flush()
        return notification
