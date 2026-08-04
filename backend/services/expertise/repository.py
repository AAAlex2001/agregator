"""Repository: доступ к БД для экспертизы промышленной безопасности."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.account import Account
from models.expert import Expert


class ExpertiseRepository:
    """Все обращения к БД для анкеты исполнителя по ЭПБ."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_account(self, account_id: int) -> Account | None:
        """Ищет аккаунт вместе с профилями ролей."""
        query = select(Account).where(Account.id == account_id)
        return (await self.db.execute(query)).scalars().first()

    async def add(self, expert: Expert) -> None:
        """Добавляет профиль исполнителя в сессию."""
        self.db.add(expert)
        await self.db.flush()
