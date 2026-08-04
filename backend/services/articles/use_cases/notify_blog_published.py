"Use case: уведомление о публикации блога — in-app всем + email подписанным. Идемпотентно по slug."

import logging

from fastapi import BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.notification import Notification, NotificationType
from services.email import EmailDispatcher, EmailRepository, SendNewBlogPostEmailUseCase
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_new_blog_post_notification import (
    CreateNewBlogPostNotificationUseCase,
)

logger = logging.getLogger(__name__)

BLOG_ACTION_URL_TEMPLATE = "/blog/{slug}"
LEGACY_BLOG_ACTION_URL_TEMPLATE = "/landing/blog/{slug}"


class NotifyBlogPublishedUseCase:
    "Рассылает уведомление о новом посте блога. Повторный вызов по тому же slug ничего не делает."

    def __init__(self, db: AsyncSession, background_tasks: BackgroundTasks) -> None:
        self.db = db
        self.background_tasks = background_tasks

    async def execute(self, slug: str, title: str, preview: str) -> tuple[int, int]:
        "Возвращает (отправлено in-app, поставлено в очередь email)."
        action_url = BLOG_ACTION_URL_TEMPLATE.format(slug=slug)
        legacy_action_url = LEGACY_BLOG_ACTION_URL_TEMPLATE.format(slug=slug)
        already = await self.db.execute(
            select(Notification.id)
            .where(
                Notification.type == NotificationType.NEW_BLOG_POST,
                Notification.action_url.in_((action_url, legacy_action_url)),
            )
            .limit(1)
        )
        if already.scalar_one_or_none() is not None:
            logger.info("Blog notification for slug=%s already sent, skipping", slug)
            return 0, 0

        in_app = await CreateNewBlogPostNotificationUseCase(
            NotificationRepository(self.db)
        ).send_notification_to_all_users(blog_title=title, preview=preview, slug=slug)
        emails = await SendNewBlogPostEmailUseCase(
            repo=EmailRepository(self.db),
            dispatcher=EmailDispatcher(self.background_tasks),
        ).execute(slug=slug, blog_title=title, preview=preview)
        return in_app, emails
