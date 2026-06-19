"Фоновая отправка одной пачки рассылки по базе компаний (триггерится кнопкой «Разослать» из админки)."

import logging

from database.database import AsyncSessionLocal
from services.campaigns.company_repository import CompanyRepository
from services.campaigns.use_cases import SendBatchUseCase

logger = logging.getLogger(__name__)


async def send_one_batch(
    subject: str,
    body_text: str,
    presentation_url: str | None,
    batch_size: int,
    range_from: int | None = None,
    range_to: int | None = None,
) -> None:
    "Разовая отправка (background task): пачка непосланных или диапазон позиций. Своя сессия БД, без цикла."
    async with AsyncSessionLocal() as db:
        repo = CompanyRepository(db)
        sent = await SendBatchUseCase(repo).execute(
            subject, body_text, presentation_url, batch_size, range_from, range_to
        )
        logger.info("Mailing one-shot done: %d companies (range=%s..%s)", sent, range_from, range_to)
