from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.database import get_db
from models.session import Session


async def get_current_user(
    session_id: str = Cookie(...),
    db: AsyncSession = Depends(get_db),
) -> int:
    result = await db.execute(
        select(Session.user_id).where(Session.session_id == session_id)
    )
    user_id = result.scalar_one_or_none()
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия не найдена или истекла",
        )
    return user_id
