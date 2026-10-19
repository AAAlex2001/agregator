"""Тесты ИИ-помощника постов без сети и БД."""

import asyncio
from datetime import UTC, datetime, timedelta

import pytest

from app.core.ai import AiError
from app.poster.ai.services.exceptions import AiUnavailableError, TooManyAiRequestsError
from app.poster.ai.services.prompt import to_html
from app.poster.ai.services.usecases.write_post import WritePostUseCase
from models.account import Account

USER = Account(id=1, email="anna@mail.ru")
REQUESTS_PER_HOUR = 30


class FakeAi:
    """Отвечает заранее заданным текстом и запоминает, что у него спросили."""

    def __init__(self, answer: str) -> None:
        self.answer = answer
        self.asked: list[str] = []

    async def complete(self, system: str, user: str, max_tokens: int) -> str:
        self.asked.append(user)
        return self.answer


class FakeAiRequests:
    """Запросы к ИИ в памяти."""

    def __init__(self, issued: list[datetime] | None = None) -> None:
        self.issued = issued or []

    async def list_since(self, user_id: int, since: datetime) -> list[datetime]:
        return [moment for moment in self.issued if moment >= since]

    async def add(self, user_id: int) -> None:
        self.issued.append(datetime.now(UTC))


def write(answer: str, html: str = "", requests: FakeAiRequests | None = None) -> str:
    usecase = WritePostUseCase(
        FakeAi(answer), requests or FakeAiRequests(), REQUESTS_PER_HOUR
    )

    return asyncio.run(usecase.execute(USER, "Напиши пост про мёд", html))


def test_answer_keeps_only_editor_tags() -> None:
    html = write("<h1>Пасека</h1><h2>Мёд</h2><p>Свежий <strong>липовый</strong></p><script>alert(1)</script>")

    assert html == "Пасека<h2>Мёд</h2><p>Свежий <strong>липовый</strong></p>"


def test_code_fence_and_plain_text_become_paragraphs() -> None:
    assert to_html("```html\n<p>Привет</p>\n```") == "<p>Привет</p>"
    assert to_html("Первый абзац\nстрока\n\nВторой") == "<p>Первый абзац<br>строка</p><p>Второй</p>"


def test_empty_answer_is_an_error() -> None:
    with pytest.raises(AiUnavailableError):
        write("<p> </p>")


def test_current_text_goes_to_the_model() -> None:
    ai = FakeAi("<p>Готово</p>")
    usecase = WritePostUseCase(ai, FakeAiRequests(), REQUESTS_PER_HOUR)

    asyncio.run(usecase.execute(USER, "Сократи", "<p>Длинный текст</p>"))

    assert "Сократи" in ai.asked[0]
    assert "<p>Длинный текст</p>" in ai.asked[0]


def test_hourly_limit_stops_requests() -> None:
    now = datetime.now(UTC)
    issued = [now - timedelta(minutes=50) + timedelta(seconds=index) for index in range(30)]

    with pytest.raises(TooManyAiRequestsError) as error:
        write("<p>Текст</p>", requests=FakeAiRequests(issued))

    assert 0 < error.value.retry_after <= 10 * 60 + 1


def test_answer_limit_counts_text_after_sanitization():
    """Разметка и экранирование не съедают лимит, длинный ответ отклоняется сервером."""
    assert write("<p>" + "&amp;" * 5000 + "</p>").startswith("<p>")
    with pytest.raises(AiUnavailableError, match="5000"):
        write("<p>" + "я" * 5001 + "</p>")


class BrokenAi:
    """Модель недоступна."""

    async def complete(self, system: str, user: str, max_tokens: int) -> str:
        raise AiError("нет ответа")


def test_unavailable_model_is_counted_and_reported():
    requests = FakeAiRequests()
    usecase = WritePostUseCase(BrokenAi(), requests, REQUESTS_PER_HOUR)

    with pytest.raises(AiUnavailableError):
        asyncio.run(usecase.execute(USER, "Напиши пост", ""))

    assert len(requests.issued) == 1
