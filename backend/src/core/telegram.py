import json
from pathlib import Path
from typing import Any

import httpx

from src.core.config import get_settings

API_URL = "https://api.telegram.org"
TIMEOUT_SECONDS = 30
UPLOAD_TIMEOUT_SECONDS = 300


class TelegramError(Exception):
    """Telegram не выполнил запрос. Может подсказать, когда повторить, и новый id чата."""

    def __init__(
        self,
        description: str,
        retry_after: int | None = None,
        new_chat_id: int | None = None,
    ) -> None:
        """Запоминает описание ошибки и подсказки Telegram: когда повторить и новый id чата."""
        super().__init__(description)
        self.description = description
        self.retry_after = retry_after
        self.new_chat_id = new_chat_id


class TelegramClient:
    """Вызывает методы Telegram-бота."""

    def __init__(self, token: str, proxy: str) -> None:
        """Запоминает токен бота и прокси, через который ходить в Telegram."""
        self.token = token
        self.proxy = proxy or None

    @property
    def bot_id(self) -> int:
        """id бота — это число в начале токена, до двоеточия."""
        return int(self.token.split(":")[0])

    async def call(self, method: str, payload: dict[str, Any]) -> Any:
        """Вызывает метод бота и возвращает result из ответа Telegram."""
        url = f"{API_URL}/bot{self.token}/{method}"

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS, proxy=self.proxy) as client:
                response = await client.post(url, json=payload)
        except httpx.HTTPError as error:
            raise TelegramError("Telegram недоступен") from error

        return read_result(response)

    async def upload(self, method: str, payload: dict[str, Any], files: dict[str, Path]) -> Any:
        """Вызывает метод бота с файлами: sendPhoto, sendVideo или sendMediaGroup."""
        url = f"{API_URL}/bot{self.token}/{method}"
        form = {}

        for key, value in payload.items():
            if isinstance(value, str):
                form[key] = value
            else:
                form[key] = json.dumps(value)

        opened_files = {name: path.open("rb") for name, path in files.items()}

        try:
            async with httpx.AsyncClient(timeout=UPLOAD_TIMEOUT_SECONDS, proxy=self.proxy) as client:
                response = await client.post(url, data=form, files=opened_files)
        except httpx.HTTPError as error:
            raise TelegramError("Telegram недоступен") from error
        finally:
            for file in opened_files.values():
                file.close()

        return read_result(response)


def read_result(response: httpx.Response) -> Any:
    """Достаёт result из ответа Telegram. Если Telegram ответил ошибкой — TelegramError."""
    try:
        body = response.json()
    except ValueError as error:
        raise TelegramError(f"Telegram ответил не JSON, код {response.status_code}") from error

    if body["ok"]:
        return body["result"]

    parameters = body.get("parameters", {})

    raise TelegramError(
        body["description"],
        retry_after=parameters.get("retry_after"),
        new_chat_id=parameters.get("migrate_to_chat_id"),
    )


def get_telegram() -> TelegramClient:
    """Создаёт клиент бота с токеном и прокси из настроек."""
    settings = get_settings()

    return TelegramClient(settings.telegram_bot_token, settings.telegram_proxy)
