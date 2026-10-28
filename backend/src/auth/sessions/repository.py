from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.sessions.models import Session


class SessionRepository:
    """Читает и записывает сессии входа."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get(self, session_id: str) -> Session | None:
        """Возвращает сессию по id из cookie вместе с аккаунтом или None."""
        query = select(Session).where(Session.session_id == session_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()
