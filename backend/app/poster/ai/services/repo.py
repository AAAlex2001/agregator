"""Запросы к ИИ-помощнику для лимита в час."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.ai.models import AiRequest
from models.account import Account


class AiRequestRepository:
    """Доступ к таблице post_ai_requests."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_since(self, user_id: int, since: datetime) -> list[datetime]:
        """Время запросов пользователя начиная с since, старые первыми.

        Запросы одного автора идут по очереди: строка аккаунта блокируется.
        """

        lock = select(Account.id).where(Account.id == user_id).with_for_update(key_share=True)
        await self.db.execute(lock)

        stmt = (
            select(AiRequest.created_at)
            .where(AiRequest.user_id == user_id, AiRequest.created_at >= since)
            .order_by(AiRequest.created_at)
        )
        times = await self.db.scalars(stmt)

        return list(times)

    async def add(self, user_id: int) -> None:
        """Записывает запрос и сразу фиксирует транзакцию — единственное место с коммитом.

        Запрос засчитывается в лимит, даже если модель потом не ответит и сессия откатится.
        Коммит же снимает блокировку автора на время долгого ответа модели.
        """

        self.db.add(AiRequest(user_id=user_id))
        await self.db.commit()
