import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from models.session import Session
from schemas.login import UserLogin, UserResponse
from services.login import LoginService

router = APIRouter(prefix="/login", tags=["auth"])

SESSION_TTL_DAYS = 7
SESSION_MAX_DAYS = 14

@router.post("/", response_model=UserResponse)
async def login_user(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    service = LoginService(db)
    user = None
    if data.email:
        user = await service.get_user_by_email(data.email)
    elif data.phone:
        user = await service.get_user_by_phone(data.phone)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    
    if not service.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
        )

    now = datetime.now(timezone.utc)
    new_session = Session(
        session_id=str(uuid.uuid4()),
        user_id=user.id,
        expires_at=now + timedelta(days=SESSION_TTL_DAYS),
        max_expires_at=now + timedelta(days=SESSION_MAX_DAYS),
    )
    db.add(new_session)
    await db.commit()

    response = JSONResponse(content=UserResponse.model_validate(user).model_dump(mode="json"))
    response.set_cookie(
        key="session_id",
        value=new_session.session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * SESSION_MAX_DAYS,
        path="/",
    )
    return response


@router.post("/refresh")
async def refresh_session(
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_db),
):
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Необходима авторизация",
        )

    result = await db.execute(select(Session).where(Session.session_id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия не найдена",
        )

    now = datetime.now(timezone.utc)
    if now > session.max_expires_at:
        await db.execute(delete(Session).where(Session.id == session.id))
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия истекла",
        )

    if session.expires_at < now:
        next_expires = now + timedelta(days=SESSION_TTL_DAYS)
        session.expires_at = min(next_expires, session.max_expires_at)
        await db.commit()

    response = JSONResponse(content={"detail": "ok"})
    remaining_seconds = max(int((session.max_expires_at - now).total_seconds()), 0)
    response.set_cookie(
        key="session_id",
        value=session.session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=remaining_seconds,
        path="/",
    )
    return response


@router.post("/logout")
async def logout_user(
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_db),
):
    if session_id:
        await db.execute(delete(Session).where(Session.session_id == session_id))
        await db.commit()

    response = JSONResponse(content={"detail": "ok"})
    response.delete_cookie(key="session_id", path="/", secure=True, samesite="none")
    return response