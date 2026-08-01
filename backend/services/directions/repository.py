"Repository: доступ к БД для направлений."
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.account import Account
from models.base import Base


class DirectionsRepository:
    "Все обращения к БД для анкет направлений."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_account(self, account_id: int) -> Account | None:
        "Ищет аккаунт вместе с профилями ролей."
        query = select(Account).where(Account.id == account_id)
        return (await self.db.execute(query)).scalars().first()

    async def add(self, entity: Base) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)
        await self.db.flush()
