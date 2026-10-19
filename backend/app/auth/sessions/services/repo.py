"""Запросы к сессиям."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.models import Session


class SessionRepository:
    """Доступ к таблице sessions."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, session_id: str) -> Session | None:
        """Сессия по id из cookie вместе с аккаунтом или None."""

        stmt = select(Session).where(Session.session_id == session_id)

        return await self.db.scalar(stmt)
