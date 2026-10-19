"""Запросы к ссылкам на бота и к Telegram-привязке аккаунтов."""

from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.telegram.link.models import TelegramLinkToken
from models.account import Account


class TelegramLinkRepository:
    """Доступ к таблице telegram_link_tokens и полю accounts.telegram_id."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, link: TelegramLinkToken) -> None:
        """Сохраняет новую ссылку."""

        self.db.add(link)
        await self.db.flush()

    async def get_unused(self, token: str, now: datetime) -> TelegramLinkToken | None:
        """Неиспользованная и не истёкшая ссылка под блокировкой или None."""

        stmt = (
            select(TelegramLinkToken)
            .where(
                TelegramLinkToken.token == token,
                TelegramLinkToken.used_at.is_(None),
                TelegramLinkToken.expires_at > now,
            )
            .with_for_update()
        )

        return await self.db.scalar(stmt)

    async def get_account(self, account_id: int) -> Account | None:
        """Аккаунт по id или None."""

        return await self.db.get(Account, account_id)

    async def find_by_telegram(self, telegram_id: int) -> Account | None:
        """Аккаунт, который последним открыл бота по ссылке с сайта.

        Telegram привязан ко всем ролям одной почты, поэтому роль определяется по ссылке.
        Без ссылки (привязка из мини-приложения) — роль, изменённая последней.
        """

        active = [Account.telegram_id == telegram_id, Account.is_active.is_(True)]
        by_link = (
            select(Account)
            .join(TelegramLinkToken, TelegramLinkToken.account_id == Account.id)
            .where(*active, TelegramLinkToken.used_at.is_not(None))
            .order_by(TelegramLinkToken.used_at.desc())
            .limit(1)
        )
        linked = await self.db.scalar(by_link)
        if linked is not None:
            return linked

        latest = select(Account).where(*active).order_by(Account.updated_at.desc()).limit(1)

        return await self.db.scalar(latest)

    async def bind(self, account: Account, telegram_id: int) -> None:
        """Привязывает Telegram ко всем ролям этой почты и отвязывает от чужих аккаунтов."""

        same_person = Account.email == account.email if account.email else Account.id == account.id

        release = (
            update(Account)
            .where(Account.telegram_id == telegram_id, ~same_person)
            .values(telegram_id=None)
            .execution_options(synchronize_session=False)
        )
        bind = (
            update(Account)
            .where(same_person)
            .values(telegram_id=telegram_id)
            .execution_options(synchronize_session=False)
        )

        await self.db.execute(release)
        await self.db.execute(bind)

        account.telegram_id = telegram_id
        await self.db.flush()
