from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

from models.session import Session
from services.login.repository import LoginRepository, SESSION_TTL_DAYS


class RefreshSessionUseCase:
    "Продлевает сессию (если не истёк max_expires_at)."

    def __init__(self, repo: LoginRepository):
        self.repo = repo

    async def execute(self, session_id: str | None) -> Session:
        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Необходима авторизация",
            )

        session = await self.repo.find_session_with_user(session_id)
        if session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия не найдена",
            )

        now = datetime.now(timezone.utc)
        if now > session.max_expires_at:
            await self.repo.delete_session_by_id(session.id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия истекла",
            )

        if session.expires_at < now:
            next_expires = now + timedelta(days=SESSION_TTL_DAYS)
            session.expires_at = min(next_expires, session.max_expires_at)
        return session
