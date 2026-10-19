"""ИИ-помощник: написать публикацию с нуля или переделать текущий текст."""

import logging
from datetime import UTC, datetime, timedelta

from app.core.ai import AiClient, AiError
from app.poster.ai.services.exceptions import AiUnavailableError, TooManyAiRequestsError
from app.poster.ai.services.prompt import SYSTEM_PROMPT, to_html, user_message
from app.poster.ai.services.repo import AiRequestRepository
from app.poster.publications.models import MAX_POST_TEXT
from app.poster.publications.services.text import clean_html, plain_text
from models.account import Account

logger = logging.getLogger(__name__)

HOUR = timedelta(hours=1)
MAX_TOKENS = 3000


class WritePostUseCase:
    """Текст публикации от ИИ по просьбе автора. Не чаще лимита запросов в час."""

    def __init__(self, ai: AiClient, requests: AiRequestRepository, requests_per_hour: int) -> None:
        self.ai = ai
        self.requests = requests
        self.requests_per_hour = requests_per_hour

    async def check_limit(self, user: Account) -> None:
        """Записывает запрос. Лимит на час исчерпан — TooManyAiRequestsError."""

        now = datetime.now(UTC)
        issued = await self.requests.list_since(user.id, now - HOUR)

        if len(issued) >= self.requests_per_hour:
            wait = issued[0] + HOUR - now
            raise TooManyAiRequestsError(max(int(wait.total_seconds()) + 1, 1))

        await self.requests.add(user.id)

    async def execute(self, user: Account, instruction: str, html: str) -> str:
        """HTML для редактора. Модель не помогла — AiUnavailableError."""

        await self.check_limit(user)

        try:
            answer = await self.ai.complete(SYSTEM_PROMPT, user_message(instruction, html), MAX_TOKENS)
        except AiError as error:
            logger.warning("ИИ-помощник не ответил: %s", error)
            raise AiUnavailableError from error

        result = clean_html(to_html(answer))
        text = plain_text(result)

        if not text:
            raise AiUnavailableError

        if len(text) > MAX_POST_TEXT:
            raise AiUnavailableError(f"Ответ ИИ длиннее {MAX_POST_TEXT} символов. Попросите написать короче")

        return result
