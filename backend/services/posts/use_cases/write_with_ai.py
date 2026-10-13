"""Сценарий ИИ-помощника: написать публикацию с нуля или переделать текущий текст."""

import logging
import re
from datetime import UTC, datetime, timedelta
from html import escape

from models.account import Account
from models.posts import MAX_POST_TEXT
from services.posts.ai import AiClient, AiError
from services.posts.ai_repo import AiRequestRepository
from services.posts.config import PostSettings
from services.posts.exceptions import AiUnavailableError, TooManyAiRequestsError
from services.posts.html import clean_html, plain_text

logger = logging.getLogger(__name__)

HOUR = timedelta(hours=1)
MAX_TOKENS = 3000
FENCE = re.compile(r"^```[a-z]*\s*|\s*```$")

SYSTEM_PROMPT = """\
Ты — редактор публикаций на «Ресурс-Плюс», профессиональной площадке промышленной \
безопасности. Публикации пишут эксперты и организации: об опыте, исследованиях, услугах \
и профессиональной работе.

Как писать:
- по-русски, если автор не просит другой язык;
- живо, понятно и по делу, без канцелярита, воды и рекламных штампов;
- не выдумывай факты о товаре, ценах, адресах и контактах — бери их только из просьбы \
и текста автора;
- длина — до 3000 символов, если автор не просит иначе.

Формат ответа — только готовый текст публикации в HTML:
- разрешены только теги <h2>, <h3>, <p>, <br>, <strong>, <em>, <u>, <blockquote> \
и <a href="https://…">;
- каждый абзац — в своём <p>;
- заголовки — только <h2> для разделов и <h3> для подразделов, и только в длинных \
текстах; короткому посту заголовки не нужны;
- без h1, h4–h6, списков, таблиц, markdown и блоков кода: вместо списка — короткие \
абзацы, можно с эмодзи;
- без пояснений, вступлений и комментариев к своей работе — только сам текст.

Если текущий текст публикации пустой — напиши публикацию с нуля по просьбе автора.
Если текст есть — измени его так, как просит автор, и верни целиком."""


def to_html(answer: str) -> str:
    """Ответ модели в HTML: без обёртки ```html, а простой текст — по абзацам."""

    text = FENCE.sub("", answer.strip())
    if "<" in text:
        return text

    paragraphs = [part.strip() for part in text.split("\n\n") if part.strip()]
    html = ""
    for paragraph in paragraphs:
        lines = escape(paragraph).replace("\n", "<br>")
        html += f"<p>{lines}</p>"
    return html


def message(instruction: str, html: str) -> str:
    """Сообщение модели: просьба автора и текущий текст публикации."""

    current = html if plain_text(html) else "(пусто)"
    return f"Просьба автора:\n{instruction}\n\nТекущий текст публикации (HTML):\n{current}"


class WritePostWithAiUseCase:
    """Текст публикации от ИИ по просьбе автора. Не чаще лимита запросов в час."""

    def __init__(
        self,
        ai: AiClient,
        requests: AiRequestRepository,
        settings: PostSettings,
    ) -> None:
        self.ai = ai
        self.requests = requests
        self.settings = settings

    async def check_limit(self, user: Account) -> None:
        """Записывает запрос. Лимит на час исчерпан — TooManyAiRequestsError."""

        now = datetime.now(UTC)
        issued = await self.requests.list_since(user.id, now - HOUR)
        if len(issued) >= self.settings.ai_requests_per_hour:
            wait = issued[0] + HOUR - now
            retry_after = max(int(wait.total_seconds()) + 1, 1)
            raise TooManyAiRequestsError(retry_after)

        await self.requests.add(user.id)

    async def execute(self, user: Account, instruction: str, html: str) -> str:
        """HTML для редактора. Модель не помогла — AiUnavailableError."""

        await self.check_limit(user)

        try:
            answer = await self.ai.complete(SYSTEM_PROMPT, message(instruction, html), MAX_TOKENS)
        except AiError as error:
            logger.warning("ИИ-помощник не ответил: %s", error)
            raise AiUnavailableError() from error

        result = clean_html(to_html(answer))
        text = plain_text(result)
        if not text:
            raise AiUnavailableError()
        if len(text) > MAX_POST_TEXT:
            raise AiUnavailableError(
                f"Ответ ИИ длиннее {MAX_POST_TEXT} символов. Попросите написать короче"
            )
        return result
