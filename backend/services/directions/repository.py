"Repository: доступ к БД для направлений."
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.base import Base
from models.expert import Expert


class DirectionsRepository:
    "Все обращения к БД для профилей направлений исполнителя."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_expert_by_account(self, account_id: int) -> Expert | None:
        "Ищет профиль исполнителя по id аккаунта."
        query = select(Expert).where(Expert.account_id == account_id)
        return (await self.db.execute(query)).scalars().first()

    async def add(self, entity: Base) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)
        await self.db.flush()
