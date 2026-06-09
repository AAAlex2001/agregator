"Use case: уведомление о новой публикации в блоге."

import logging

from models.notification import Notification, NotificationType
from schemas.notification import NewBlogPostNotificationPayload
from services.notifications.repository import NotificationRepository

logger = logging.getLogger(__name__)

PREVIEW_MAX_LENGTH = 240
BLOG_URL_TEMPLATE = "/landing/blog/{slug}"


def truncate_text(text: str) -> str:
    "Обрезает текст до PREVIEW_MAX_LENGTH символов, добавляя многоточие."
    text = (text or "").strip()
    if len(text) > PREVIEW_MAX_LENGTH:
        return text[:PREVIEW_MAX_LENGTH] + "…"
    return text or "(пусто)"


class CreateNewBlogPostNotificationUseCase:
    "Создание in-app уведомления о новой статье в блоге — для одного пользователя или для всех сразу."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        user_id: int,
        blog_title: str,
        preview: str,
        action_url: str,
    ) -> Notification:
        "Создаёт уведомление одному пользователю и увеличивает его счётчик непрочитанных."
        payload = NewBlogPostNotificationPayload(
            blog_title=blog_title,
            preview=truncate_text(preview),
        )
        notification = Notification(
            user_id=user_id,
            type=NotificationType.NEW_BLOG_POST,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(user_id)
        await self.repo.flush()
        return notification

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
            preview=truncate_text(preview),
        )
        payload_dump = payload.model_dump(mode="json")

        user_ids = await self.repo.list_all_user_ids()
        for user_id in user_ids:
            notification = Notification(
                user_id=user_id,
                type=NotificationType.NEW_BLOG_POST,
                payload=payload_dump,
                action_url=action_url,
            )
            await self.repo.add(notification)
            await self.repo.increment_unread(user_id)
        await self.repo.flush()

        logger.info("Sent blog notification to %d users (slug=%s)", len(user_ids), slug)
        return len(user_ids)
