"Рассылка email-кампаний. Сейчас — разовая отправка одной пачки по кнопке. Цикл оставлен для будущего автопрогона."

import asyncio
import logging

from database.database import AsyncSessionLocal
from models.campaign import CampaignStatus
from services.campaigns.repository import CampaignRepository
from services.campaigns.use_cases import SendBatchUseCase

logger = logging.getLogger(__name__)

CHECK_INTERVAL_SECONDS = 300  # одна пачка раз в 5 минут — мягкий троттлинг, не палим домен


async def send_one_campaign_batch(
    campaign_id: int, subject: str, batch_size: int, presentation_path: str | None
) -> None:
    "Разовая отправка ОДНОЙ пачки кампании (background task). Открывает свою сессию БД, без цикла."
    async with AsyncSessionLocal() as db:
        repo = CampaignRepository(db)
        sender = SendBatchUseCase(repo)
        processed = await sender.execute(campaign_id, subject, batch_size, presentation_path)
        await db.commit()
        logger.info("Campaign %d: one-shot batch sent (%d recipients)", campaign_id, processed)


async def process_running_campaigns() -> None:
    "Для каждой RUNNING-кампании шлёт одну пачку. Если пачек больше нет — помечает DONE."
    async with AsyncSessionLocal() as db:
        repo = CampaignRepository(db)
        campaigns = await repo.list_running_campaigns()
        for campaign in campaigns:
            sender = SendBatchUseCase(repo)
            processed = await sender.execute(
                campaign.id, campaign.subject, campaign.batch_size, campaign.presentation_path
            )
            if processed == 0:
                remaining = await repo.pending_count(campaign.id)
                if remaining == 0:
                    await repo.set_status(campaign.id, CampaignStatus.DONE)
                    logger.info("Campaign %d done — no pending recipients left", campaign.id)
        await db.commit()


async def run_campaign_sender_loop() -> None:
    "Бесконечный цикл воркера рассылки. Падение одной итерации не роняет цикл."
    while True:
        try:
            await process_running_campaigns()
        except Exception:
            logger.exception("Error in campaign sender task")
        await asyncio.sleep(CHECK_INTERVAL_SECONDS)
