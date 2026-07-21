from models.notification import Notification, NotificationType
from schemas.notification import ContactAccessNotificationPayload
from services.notifications.repository import NotificationRepository


class CreateContactAccessNotificationUseCase:
    def __init__(self, repository: NotificationRepository) -> None:
        self.repository = repository

    async def execute(
        self,
        user_id: int,
        title: str,
        message: str,
        action_url: str = "/expert-contacts",
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=NotificationType.CONTACT_ACCESS,
            payload=ContactAccessNotificationPayload(
                title=title,
                message=message,
            ).model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repository.add(notification)
        await self.repository.flush()
        await self.repository.increment_unread(user_id)
        await self.repository.flush()
        return notification
