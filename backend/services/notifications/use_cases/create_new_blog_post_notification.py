"Use case: уведомление о новой публикации в блоге."

import logging

from models.notification import Notification, NotificationType
from schemas.notification import NewBlogPostNotificationPayload
from services.notifications.formatters import truncate_preview
from services.notifications.repository import NotificationRepository

logger = logging.getLogger(__name__)

BLOG_URL_TEMPLATE = "/blog/{slug}"


class CreateNewBlogPostNotificationUseCase:
    "Создание in-app уведомления о новой статье в блоге для всех пользователей."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def send_notification_to_all_users(
        self,
        blog_title: str,
        preview: str,
        slug: str,
    ) -> int:
        "Рассылает уведомление всем пользователям. Возвращает число получателей."
        action_url = BLOG_URL_TEMPLATE.format(slug=slug)
        payload = NewBlogPostNotificationPayload(
            blog_title=blog_title,
            preview=truncate_preview(preview),
        )
        payload_dump = payload.model_dump(mode="json")

        total = 0
        async for user_ids_batch in self.repo.iter_all_user_ids_in_batches():
            for user_id in user_ids_batch:
                notification = Notification(
                    user_id=user_id,
                    type=NotificationType.NEW_BLOG_POST,
                    payload=payload_dump,
                    action_url=action_url,
                )
                await self.repo.add(notification)
                await self.repo.increment_unread(user_id)
            await self.repo.flush()
            total += len(user_ids_batch)

        logger.info("Sent blog notification to %d users (slug=%s)", total, slug)
        return total
