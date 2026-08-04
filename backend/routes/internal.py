"Внутренние ручки, которые дёргает admin-сервис по X-Internal-Token. Не для пользователей."

import logging

from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from schemas.internal import (
    BlogPublishedRequest,
    BroadcastResult,
    CompaniesStatsResponse,
    ImportStartedResult,
    SendBatchQueuedResult,
    SendBatchRequest,
)
from services.campaigns import CompanyRepository, import_companies_from_file
from services.campaigns.storage import companies_json_path
from services.email import EmailDispatcher, EmailRepository, SendNewBlogPostEmailUseCase
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_new_blog_post_notification import (
    CreateNewBlogPostNotificationUseCase,
)
from tasks.mailing import send_one_batch
from utils.email_templates import render_email

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


@router.post("/companies/import", response_model=ImportStartedResult)
async def import_companies(background_tasks: BackgroundTasks) -> ImportStartedResult:
    "Запускает потоковый импорт базы компаний из JSON (в общем томе) в таблицу companies — в фоне (upsert по ИНН)."
    background_tasks.add_task(import_companies_from_file, companies_json_path())
    return ImportStartedResult()


@router.get("/companies/stats", response_model=CompaniesStatsResponse)
async def companies_stats(db: AsyncSession = Depends(get_db)) -> CompaniesStatsResponse:
    "Состояние базы: всего / пригодны к рассылке / уже отправлено / осталось."
    repo = CompanyRepository(db)
    return CompaniesStatsResponse(
        total=await repo.total_count(),
        sendable=await repo.sendable_count(),
        sent=await repo.sent_count(),
        remaining=await repo.remaining_count(),
    )


@router.get("/mailing-preview", response_class=HTMLResponse)
async def mailing_preview(
    subject: str = Query("Тема письма", max_length=300),
    body_text: str = Query("Текст письма", max_length=5000),
    presentation_url: str | None = Query(None, max_length=500),
) -> HTMLResponse:
    "Рендерит письмо с примером компании и переданным текстом — для превью в админке перед отправкой."
    rendered = render_email(
        "campaign_presentation",
        subject,
        {"company_name": "ООО «Пример»", "body_text": body_text, "presentation_url": presentation_url},
    )
    return HTMLResponse(rendered.html)


@router.post("/mailing/send-batch", response_model=SendBatchQueuedResult)
async def send_batch(
    data: SendBatchRequest,
    background_tasks: BackgroundTasks,
) -> SendBatchQueuedResult:
    "РАЗОВО шлёт письма + контрольные seed-адреса: либо пачку непосланных, либо диапазон позиций базы. Презентация — ссылкой в письме."
    background_tasks.add_task(
        send_one_batch,
        data.subject,
        data.body_text,
        data.presentation_url,
        data.batch_size,
        data.range_from,
        data.range_to,
    )
    return SendBatchQueuedResult()
