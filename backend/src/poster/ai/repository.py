from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.ai.models import AiRequest


class AiRequestRepository:
    """Читает и записывает запросы к ИИ-помощнику."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def list_times_since(self, user_id: int, since: datetime) -> list[datetime]:
        """Возвращает время запросов пользователя после since, самые ранние первыми."""
        query = (
            select(AiRequest.created_at)
            .where(AiRequest.user_id == user_id, AiRequest.created_at > since)
            .order_by(AiRequest.created_at)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def add(self, user_id: int) -> None:
        """Записывает, что пользователь только что обратился к ИИ."""
        self.db.add(AiRequest(user_id=user_id))
        await self.db.flush()
