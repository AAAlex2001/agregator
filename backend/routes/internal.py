"Внутренние ручки, которые дёргает admin-сервис по X-Internal-Token. Не для пользователей."

import logging

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from schemas.internal import BlogPublishedRequest, BroadcastResult
from services.email import EmailDispatcher, EmailRepository, SendNewBlogPostEmailUseCase
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_new_blog_post_notification import (
    CreateNewBlogPostNotificationUseCase,
)

logger = logging.getLogger(__name__)
BLOG_ACTION_URL_TEMPLATE = "/blog/{slug}"
LEGACY_BLOG_ACTION_URL_TEMPLATE = "/landing/blog/{slug}"

router = APIRouter(prefix="/internal", tags=["internal"], dependencies=[Depends(require_internal_token)])


@router.post("/blog/published", response_model=BroadcastResult)
async def notify_blog_published(
    data: BlogPublishedRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> BroadcastResult:
    "Триггерит in-app рассылку всем и email-рассылку подписанным. Идемпотентно по slug — повторный вызов ничего не делает."
    action_url = BLOG_ACTION_URL_TEMPLATE.format(slug=data.slug)
    legacy_action_url = LEGACY_BLOG_ACTION_URL_TEMPLATE.format(slug=data.slug)
    repo = NotificationRepository(db)
    if await repo.new_blog_post_notification_exists((action_url, legacy_action_url)):
        logger.info("Blog notification for slug=%s already sent, skipping", data.slug)
        return BroadcastResult(notifications_sent=0, emails_queued=0)

    in_app = await CreateNewBlogPostNotificationUseCase(repo).send_notification_to_all_users(
        blog_title=data.title,
        preview=data.preview,
        slug=data.slug,
    )
    emails = await SendNewBlogPostEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    ).execute(slug=data.slug, blog_title=data.title, preview=data.preview)
    return BroadcastResult(notifications_sent=in_app, emails_queued=emails)
