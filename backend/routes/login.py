from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.login import (
    SwitchRoleRequest,
    UserLogin,
    UserResponse,
)
from services.login import (
    AuthenticateUserUseCase,
    CreateSessionUseCase,
    ListAvailableRolesUseCase,
    LoginRepository,
    LoginValidator,
    LogoutSessionUseCase,
    RefreshSessionUseCase,
    SESSION_MAX_DAYS,
    SwitchRoleUseCase,
)

router = APIRouter(prefix="/login", tags=["auth"])


def build_repo(db: AsyncSession) -> LoginRepository:
    return LoginRepository(db)


@router.post(
    "/",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit("login", max_calls=5, window_seconds=60))],
)
async def login_user(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    repo = build_repo(db)
    user = await AuthenticateUserUseCase(repo, LoginValidator()).execute(data)
    new_session = await CreateSessionUseCase(repo).execute(user.id)

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
    session = await RefreshSessionUseCase(build_repo(db)).execute(session_id)

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
    await LogoutSessionUseCase(build_repo(db)).execute(session_id)

    response = JSONResponse(content={"detail": "ok"})
    response.delete_cookie(key="session_id", path="/", secure=True, samesite="none")
    response.delete_cookie(key="user_role", path="/", secure=True, samesite="none")
    return response


@router.get("/available-roles")
async def list_available_roles(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    return await ListAvailableRolesUseCase(build_repo(db)).execute(user_id)


@router.post(
    "/switch-role",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit("switch_role", max_calls=5, window_seconds=60))],
)
async def switch_role(
    payload: SwitchRoleRequest,
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    new_session = await SwitchRoleUseCase(repo, LoginValidator()).execute(
        current_user_id=user_id,
        target_role=payload.role,
        password=payload.password,
        current_session_id=session_id,
    )
    target_user = await repo.find_user_by_id(new_session.user_id)

    response = JSONResponse(content=UserResponse.model_validate(target_user).model_dump(mode="json"))
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
        value=target_user.role.value,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * SESSION_MAX_DAYS,
        path="/",
    )
    return response
