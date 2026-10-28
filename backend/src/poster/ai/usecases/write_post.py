import math
from datetime import UTC, datetime, timedelta

from src.accounts.models import Account
from src.core.ai import AiClient, AiError
from src.poster.ai.exceptions import AiUnavailableError, TooManyAiRequestsError
from src.poster.ai.prompt import SYSTEM_PROMPT, answer_to_html, user_message
from src.poster.ai.repository import AiRequestRepository
from src.poster.ai.schemas import WriteWithAiRequest, WriteWithAiResponse
from src.poster.posts.models import MAX_POST_TEXT
from src.poster.posts.text import clean_html, plain_text

MAX_TOKENS = 3000


class WritePostUseCase:
    """ИИ-помощник: пишет текст поста по просьбе автора или переделывает текущий."""

    def __init__(self, ai: AiClient, requests: AiRequestRepository, requests_per_hour: int) -> None:
        """Принимает клиент нейросети, запросы к ИИ и сколько запросов в час можно делать."""
        self.ai = ai
        self.requests = requests
        self.requests_per_hour = requests_per_hour

    async def execute(self, *, user: Account, data: WriteWithAiRequest) -> WriteWithAiResponse:
        """Спрашивает нейросеть и возвращает готовый текст. В лимит идут только удачные запросы."""
        now = datetime.now(UTC)
        request_times = await self.requests.list_times_since(user.id, now - timedelta(hours=1))

        if len(request_times) >= self.requests_per_hour:
            wait_minutes = math.ceil((request_times[0] + timedelta(hours=1) - now).total_seconds() / 60)
            raise TooManyAiRequestsError(f"Лимит запросов к ИИ исчерпан. Попробуйте через {wait_minutes} мин")

        try:
            message = user_message(data.instruction, data.html)
            answer = await self.ai.complete(SYSTEM_PROMPT, message, MAX_TOKENS)
        except AiError as error:
            raise AiUnavailableError() from error

        await self.requests.add(user.id)
        html = clean_html(answer_to_html(answer))
        text_length = len(plain_text(html))

        if text_length == 0:
            raise AiUnavailableError()

        if text_length > MAX_POST_TEXT:
            raise AiUnavailableError(f"Ответ ИИ длиннее {MAX_POST_TEXT} символов. Попросите написать короче")

        return WriteWithAiResponse(html=html)
