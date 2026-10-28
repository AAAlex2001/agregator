from datetime import UTC, datetime
from typing import Annotated

from fastapi import Cookie, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.models import Account
from src.auth.sessions.exceptions import (
    NotAuthenticatedError,
    SessionExpiredError,
    SessionNotFoundError,
    SessionRefreshRequiredError,
)
from src.auth.sessions.repository import SessionRepository
from src.core.database import get_db


async def require_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    session_id: Annotated[str | None, Cookie()] = None,
) -> Account:
    """Возвращает вошедший аккаунт по cookie сессии. Если войти не получилось — ошибка 401 с причиной."""
    if session_id is None:
        raise NotAuthenticatedError()

    session = await SessionRepository(db).get(session_id)

    if session is None:
        raise SessionNotFoundError()

    now = datetime.now(UTC)

    if now > session.max_expires_at:
        raise SessionExpiredError()

    if now > session.expires_at:
        raise SessionRefreshRequiredError()

    if not session.user.is_active:
        raise NotAuthenticatedError()

    return session.user


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    session_id: Annotated[str | None, Cookie()] = None,
) -> Account | None:
    """Возвращает вошедший аккаунт для страниц, открытых и гостям. Гостю — None."""
    if session_id is None:
        return None

    session = await SessionRepository(db).get(session_id)

    if session is None or datetime.now(UTC) > session.expires_at or not session.user.is_active:
        return None

    return session.user
