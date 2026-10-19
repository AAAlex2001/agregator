"""Привязка Telegram по токену из ссылки /start."""

from datetime import UTC, datetime

from app.telegram.link.services.repo import TelegramLinkRepository
from models.account import Account


class LinkAccountUseCase:
    """Помечает ссылку использованной и привязывает Telegram к её аккаунту."""

    def __init__(self, links: TelegramLinkRepository) -> None:
        self.links = links

    async def execute(self, token: str, telegram_id: int) -> Account | None:
        """Привязанный аккаунт. Ссылка истекла, использована или аккаунт отключён — None."""

        now = datetime.now(UTC)
        link = await self.links.get_unused(token, now)
        if link is None:
            return None

        link.used_at = now
        account = await self.links.get_account(link.account_id)
        if account is None or not account.is_active:
            return None

        await self.links.bind(account, telegram_id)

        return account
