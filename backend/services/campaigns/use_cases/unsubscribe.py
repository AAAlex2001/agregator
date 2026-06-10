"Use case: отписка адреса от рассылок (добавление в глобальный стоп-лист)."

import logging

from models.campaign import SuppressionReason
from services.campaigns.repository import CampaignRepository

logger = logging.getLogger(__name__)


class UnsubscribeUseCase:
    "Добавляет адрес в стоп-лист по клику на ссылку отписки в письме."

    def __init__(self, repo: CampaignRepository) -> None:
        self.repo = repo

    async def execute(self, email: str) -> None:
        "Регистрирует отписку. Идемпотентна — повторный клик не ломает."
        normalized = email.strip().lower()
        if not normalized or "@" not in normalized:
            return
        await self.repo.add_suppression(normalized, SuppressionReason.UNSUBSCRIBE)
        logger.info("Unsubscribed: %s", normalized)
