from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from schemas.login import UserLogin, UserResponse
from services.login import LoginService, SESSION_MAX_DAYS

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/", response_model=UserResponse)
async def login_user(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    service = LoginService(db)
    user = await service.authenticate_user(data)
    new_session = await service.create_session(user.id)

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
    response.set_cookie(
        key="user_role",
        value=user.role.value,
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
    service = LoginService(db)
    session = await service.refresh_session(session_id)

    now = datetime.now(timezone.utc)
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
    if session.user is not None:
        response.set_cookie(
            key="user_role",
            value=session.user.role.value,
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
    service = LoginService(db)
    await service.logout_session(session_id)

    response = JSONResponse(content={"detail": "ok"})
    response.delete_cookie(key="session_id", path="/", secure=True, samesite="none")
    response.delete_cookie(key="user_role", path="/", secure=True, samesite="none")
    return response