"""Ссылка на бота для привязки Telegram."""

import secrets
from datetime import UTC, datetime, timedelta

from app.core.telegram import TelegramApi
from app.telegram.link.models import TelegramLinkToken
from app.telegram.link.services.exceptions import BotUnavailableError
from app.telegram.link.services.repo import TelegramLinkRepository
from models.account import Account

LINK_TTL = timedelta(minutes=15)


class CreateLinkUseCase:
    """Одноразовая ссылка t.me/<бот>?start=<токен> на 15 минут."""

    def __init__(self, links: TelegramLinkRepository, api: TelegramApi) -> None:
        self.links = links
        self.api = api

    async def execute(self, user: Account) -> str:
        """Адрес ссылки. Бот не настроен — BotUnavailableError."""

        username = await self.api.username()
        if username is None:
            raise BotUnavailableError

        token = secrets.token_urlsafe(24)
        expires_at = datetime.now(UTC) + LINK_TTL
        await self.links.add(TelegramLinkToken(token=token, account_id=user.id, expires_at=expires_at))

        return f"https://t.me/{username}?start={token}"
