"Внутренние ручки, которые дёргает admin-сервис по X-Internal-Token. Не для пользователей."

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from schemas.internal import (
    BlogPublishedRequest,
    BroadcastResult,
    CampaignActionResult,
    CampaignCreatedResult,
    CampaignStatsResponse,
    CreateCampaignRequest,
)
from services.campaigns import CampaignRepository, import_recipients_from_file
from services.campaigns.storage import import_json_path, presentation_path
from services.email import EmailDispatcher, EmailRepository, SendNewBlogPostEmailUseCase
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_new_blog_new import (
    CreateNewBlogPostNotificationUseCase,
)
from tasks.campaign_sender import send_one_campaign_batch
from utils.email_templates import render_email

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


@router.post("/campaigns", response_model=CampaignCreatedResult)
async def create_campaign(
    data: CreateCampaignRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> CampaignCreatedResult:
    "Создаёт кампанию в DRAFT, привязывает PDF и запускает потоковый импорт получателей из JSON-базы в фоне."
    repo = CampaignRepository(db)
    campaign = await repo.create_campaign(data.name, data.subject, data.batch_size)

    if data.has_presentation:
        await repo.set_presentation_path(campaign.id, str(presentation_path(data.import_token)))

    await db.commit()

    json_path = import_json_path(data.import_token)
    background_tasks.add_task(
        import_recipients_from_file, campaign.id, json_path, data.only_active
    )
    return CampaignCreatedResult(campaign_id=campaign.id, status=campaign.status.value)


@router.get("/campaign-preview", response_class=HTMLResponse)
async def campaign_preview(
    subject: str = Query("Тема письма", max_length=300),
    has_presentation: bool = Query(True),
) -> HTMLResponse:
    "Рендерит письмо кампании с примером компании — для превью в админке перед запуском."
    rendered = render_email(
        "campaign_presentation",
        subject,
        {
            "company_name": "ООО «Пример»",
            "has_presentation": has_presentation,
            "unsubscribe_url": "https://plus-resurs.com/api/unsubscribe?email=example@mail.ru",
        },
    )
    return HTMLResponse(rendered.html)


@router.post("/campaigns/{campaign_id}/send-batch", response_model=CampaignActionResult)
async def send_one_batch(
    campaign_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> CampaignActionResult:
    "РАЗОВО шлёт одну пачку (batch_size) этой кампании + контрольные seed-адреса. Без цикла — нажал, отправилось, посмотрел."
    repo = CampaignRepository(db)
    campaign = await repo.get_campaign(campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Кампания не найдена")
    background_tasks.add_task(
        send_one_campaign_batch,
        campaign_id,
        campaign.subject,
        campaign.batch_size,
        campaign.presentation_path,
    )
    return CampaignActionResult(campaign_id=campaign_id, status="batch_queued")


@router.get("/campaigns/{campaign_id}/stats", response_model=CampaignStatsResponse)
async def campaign_stats(
    campaign_id: int,
    db: AsyncSession = Depends(get_db),
) -> CampaignStatsResponse:
    "Состояние кампании: статус, размер пачки, счётчики по статусам доставки."
    repo = CampaignRepository(db)
    campaign = await repo.get_campaign(campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Кампания не найдена")
    counts = await repo.count_by_status(campaign_id)
    pending = await repo.pending_count(campaign_id)
    return CampaignStatsResponse(
        campaign_id=campaign_id,
        status=campaign.status.value,
        batch_size=campaign.batch_size,
        pending=pending,
        counts=counts,
    )
