"""Repository: доступ к БД для анкеты эколога."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.account import Account
from models.ecology import ExpertEcologyProfile


class EcologyRepository:
    """Все обращения к БД для анкеты эколога."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_account(self, account_id: int) -> Account | None:
        """Ищет аккаунт вместе с профилями ролей."""
        query = select(Account).where(Account.id == account_id)
        return (await self.db.execute(query)).scalars().first()

    async def add(self, profile: ExpertEcologyProfile) -> None:
        """Добавляет анкету в сессию."""
        self.db.add(profile)
        await self.db.flush()
