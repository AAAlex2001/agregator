"Внутренние ручки, которые дёргает admin-сервис по X-Internal-Token. Не для пользователей."

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from schemas.internal import BlogPublishedRequest, BroadcastResult
from services.email import EmailDispatcher, EmailRepository, SendNewBlogPostEmailUseCase
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_new_blog_new import (
    CreateNewBlogPostNotificationUseCase,
)

router = APIRouter(prefix="/internal", tags=["internal"], dependencies=[Depends(require_internal_token)])


@router.post("/blog/published", response_model=BroadcastResult)
async def notify_blog_published(
    data: BlogPublishedRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> BroadcastResult:
    "Триггерит in-app рассылку всем и email-рассылку подписанным. Дёргается админкой после публикации статьи."
    in_app = await CreateNewBlogPostNotificationUseCase(NotificationRepository(db)).send_notification_to_all_users(
        blog_title=data.title,
        preview=data.preview,
        slug=data.slug,
    )
    emails = await SendNewBlogPostEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    ).execute(slug=data.slug, blog_title=data.title, preview=data.preview)
    return BroadcastResult(notifications_sent=in_app, emails_queued=emails)
