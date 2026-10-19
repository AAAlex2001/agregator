"""Клиент Telegram Bot API. Не бросает исключений: любой исход — TelegramReply."""

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

API_URL = "https://api.telegram.org"
TIMEOUT_SECONDS = 30
UPLOAD_TIMEOUT_SECONDS = 300

ERROR_TEXTS = {
    "chat not found": "Бот не видит чат: добавьте его заново",
    "bot was kicked": "Бота удалили из чата",
    "bot is not a member": "Бот не состоит в чате",
    "not enough rights": "У бота нет прав на публикацию",
    "need administrator rights": "Бот должен быть администратором",
    "message is too long": "Текст длиннее лимита Telegram",
    "caption is too long": "Подпись к медиа длиннее лимита Telegram",
    "file is too big": "Файл больше лимита Telegram",
    "message to edit not found": "Сообщение в Telegram уже удалено",
    "message can't be deleted": "Telegram не даёт удалить сообщение: прошло больше 48 часов",
}


@dataclass
class TelegramReply:
    """Ответ Bot API: результат или понятная ошибка, пауза при 429 и новый id группы."""

    result: Any = None
    error: str | None = None
    retry_after: int | None = None
    migrate_to_chat_id: int | None = None

    @property
    def ok(self) -> bool:
        """Запрос выполнен."""

        return self.error is None


def readable_error(description: str) -> str:
    """Ошибка Telegram по-русски, если она знакома, иначе как есть."""

    lowered = description.lower()
    known = [text for fragment, text in ERROR_TEXTS.items() if fragment in lowered]

    return known[0] if known else description


def parse_reply(data: dict[str, Any]) -> TelegramReply:
    """Ответ Bot API в TelegramReply. «Не изменено» при правке считается успехом."""

    if data.get("ok"):
        return TelegramReply(result=data.get("result"))

    description = str(data.get("description", "Ошибка Telegram"))
    if "message is not modified" in description:
        return TelegramReply(result=True)

    parameters = data.get("parameters") or {}

    return TelegramReply(
        error=readable_error(description),
        retry_after=parameters.get("retry_after"),
        migrate_to_chat_id=parameters.get("migrate_to_chat_id"),
    )


class TelegramApi:
    """Вызовы методов бота с токеном и прокси из настроек."""

    usernames: dict[str, str] = {}

    def __init__(self, token: str, proxy: str) -> None:
        self.token = token
        self.proxy = proxy or None

    @property
    def bot_id(self) -> int:
        """Id бота — часть токена до двоеточия."""

        return int(self.token.split(":")[0])

    async def username(self) -> str | None:
        """Имя бота без @ для ссылок t.me. Спрашивается у Telegram один раз."""

        if self.token not in self.usernames:
            reply = await self.call("getMe", {})
            if not reply.ok:
                return None

            self.usernames[self.token] = reply.result["username"]

        return self.usernames[self.token]

    async def call(self, method: str, payload: dict[str, Any]) -> TelegramReply:
        """Метод с JSON-телом: sendMessage, getChat, editMessageText и другие."""

        return await self.send(method, TIMEOUT_SECONDS, json=payload)

    async def upload(self, method: str, payload: dict[str, Any], files: dict[str, Path]) -> TelegramReply:
        """Метод с файлами: sendPhoto, sendVideo, sendMediaGroup. Файлы — attach://<имя>."""

        form = {key: value if isinstance(value, str) else json.dumps(value) for key, value in payload.items()}
        opened = {name: path.open("rb") for name, path in files.items()}

        try:
            return await self.send(method, UPLOAD_TIMEOUT_SECONDS, data=form, files=opened)
        finally:
            for file in opened.values():
                file.close()

    async def send(self, method: str, wait_seconds: int, **request: Any) -> TelegramReply:
        """Запрос к Bot API. Сеть или неожиданный ответ — TelegramReply с ошибкой."""

        if not self.token:
            return TelegramReply(error="Telegram-бот не настроен")

        url = f"{API_URL}/bot{self.token}/{method}"

        try:
            async with httpx.AsyncClient(timeout=wait_seconds, proxy=self.proxy) as client:
                response = await client.post(url, **request)
        except httpx.HTTPError as error:
            logger.warning("Telegram %s: сеть недоступна: %s", method, type(error).__name__)
            return TelegramReply(error="Telegram сейчас недоступен")

        if response.status_code == 413:
            return TelegramReply(error=ERROR_TEXTS["file is too big"])

        try:
            return parse_reply(response.json())
        except ValueError:
            return TelegramReply(error=f"Telegram ответил {response.status_code}")


def get_telegram_api() -> TelegramApi:
    """Клиент бота из настроек."""

    settings = get_settings()

    return TelegramApi(settings.telegram_bot_token, settings.telegram_proxy)
