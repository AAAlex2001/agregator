"""Кто делает запрос: аккаунт из cookie сессии."""

from datetime import UTC, datetime

from fastapi import Cookie, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.models import Session
from app.auth.sessions.services.exceptions import (
    NotAuthenticatedError,
    SessionExpiredError,
    SessionNotFoundError,
    SessionRefreshRequiredError,
)
from app.auth.sessions.services.repo import SessionRepository
from app.core.database import get_db
from models.account import Account


def get_session_repository(db: AsyncSession = Depends(get_db)) -> SessionRepository:
    """Репозиторий сессий с сессией базы текущего запроса."""

    return SessionRepository(db)


async def require_session(
    session_id: str | None = Cookie(None),
    sessions: SessionRepository = Depends(get_session_repository),
) -> Session:
    """Действующая сессия из cookie. Нет, не найдена или истекла — 401 со своим текстом."""

    if not session_id:
        raise NotAuthenticatedError

    session = await sessions.get(session_id)
    if session is None:
        raise SessionNotFoundError

    now = datetime.now(UTC)
    if now > session.max_expires_at:
        raise SessionExpiredError
    if now > session.expires_at:
        raise SessionRefreshRequiredError

    return session


async def require_user(session: Session = Depends(require_session)) -> Account:
    """Действующий аккаунт. Отключённый — 401."""

    if not session.user.is_active:
        raise NotAuthenticatedError

    return session.user


async def get_current_user(
    session_id: str | None = Cookie(None),
    sessions: SessionRepository = Depends(get_session_repository),
) -> Account | None:
    """Аккаунт для страниц, открытых и гостям. Без действующей сессии — None."""

    if not session_id:
        return None

    session = await sessions.get(session_id)
    if session is None or datetime.now(UTC) > session.expires_at:
        return None

    if not session.user.is_active:
        return None

    return session.user
