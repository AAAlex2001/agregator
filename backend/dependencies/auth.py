from datetime import UTC, datetime

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.database import get_db
from models.session import Session


async def get_current_user(
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_db),
) -> int:
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Необходима авторизация",
        )
    result = await db.execute(
        select(Session).where(Session.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия не найдена или истекла",
        )

    now = datetime.now(UTC)
    if now > session.max_expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия истекла",
        )

    if now > session.expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется обновление сессии",
        )

    return session.user_id


async def get_current_user_optional(
    session_id: str | None = Cookie(None),
    db: AsyncSession = Depends(get_db),
) -> int | None:
    "Возвращает user_id если есть валидная сессия, иначе None. Не падает на 401."
    if not session_id:
        return None
    result = await db.execute(
        select(Session).where(Session.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if session is None:
        return None
    now = datetime.now(UTC)
    if now > session.max_expires_at or now > session.expires_at:
        return None
    return session.user_id
