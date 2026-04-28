from models.notification import Notification, NotificationType
from models.user import UserRole
from schemas.notification import ChatMessageNotificationPayload
from services.notifications.repository import NotificationRepository


class CreateChatMessageNotificationUseCase:
    "In-app уведомление о новом сообщении в чате (получателю)."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(
        self,
        user_id: int,
        order_title: str,
        sender_role: UserRole,
        preview: str,
        action_url: str | None = None,
    ) -> Notification:
        payload = ChatMessageNotificationPayload(
            order_title=order_title,
            sender_role=sender_role,
            preview=preview,
        )
        notification = Notification(
            user_id=user_id,
            type=NotificationType.CHAT_MESSAGE,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(user_id)
        await self.repo.flush()
        return notification
