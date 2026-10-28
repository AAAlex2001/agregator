from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.models import Account


class AccountRepository:
    """Читает и записывает аккаунты. Единственное место, которое работает с таблицей accounts."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get(self, account_id: int) -> Account | None:
        """Возвращает аккаунт по id или None."""
        query = select(Account).where(Account.id == account_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_by_ids(self, account_ids: set[int]) -> dict[int, Account]:
        """Возвращает аккаунты по списку id: по id — аккаунт."""
        query = select(Account).where(Account.id.in_(account_ids))
        result = await self.db.execute(query)

        return {account.id: account for account in result.scalars()}

    async def add_unread_notification(self, account_id: int) -> None:
        """Прибавляет аккаунту одно непрочитанное уведомление прямо в базе."""
        query = (
            update(Account)
            .where(Account.id == account_id)
            .values(notification_unread_count=Account.notification_unread_count + 1)
        )
        await self.db.execute(query)

    async def mark_following_seen(self, account_id: int) -> None:
        """Запоминает, что человек только что открыл ленту подписок."""
        query = update(Account).where(Account.id == account_id).values(following_seen_at=func.now())
        await self.db.execute(query)
