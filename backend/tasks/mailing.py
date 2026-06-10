"Фоновая отправка одной пачки рассылки по базе компаний (триггерится кнопкой «Разослать» из админки)."

import logging

from database.database import AsyncSessionLocal
from services.campaigns.company_repository import CompanyRepository
from services.campaigns.use_cases import SendBatchUseCase

logger = logging.getLogger(__name__)


async def send_one_batch(
    subject: str, body_text: str, presentation_url: str | None, batch_size: int
) -> None:
    "Разовая отправка одной пачки (background task). Открывает свою сессию БД, без цикла."
    async with AsyncSessionLocal() as db:
        repo = CompanyRepository(db)
        sent = await SendBatchUseCase(repo).execute(subject, body_text, presentation_url, batch_size)
        await db.commit()
        logger.info("Mailing one-shot batch done: %d companies", sent)
