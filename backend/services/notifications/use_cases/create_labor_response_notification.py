from models.notification import Notification, NotificationType
from schemas.notification import LaborResponseNotificationPayload
from services.notifications.repository import NotificationRepository


class CreateLaborResponseNotificationUseCase:
    def __init__(self, repository: NotificationRepository) -> None:
        self.repository = repository

    async def execute(
        self,
        user_id: int,
        responder_name: str,
        listing_title: str,
        action_url: str,
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=NotificationType.LABOR_RESPONSE,
            payload=LaborResponseNotificationPayload(
                responder_name=responder_name,
                listing_title=listing_title,
            ).model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repository.add(notification)
        await self.repository.flush()
        await self.repository.increment_unread(user_id)
        await self.repository.flush()
        return notification
