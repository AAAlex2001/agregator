from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.telegram_auth import TelegramAuthRequest, TelegramLinkRequest
from services.login import (
    SESSION_COOKIE_MAX_AGE_SECONDS,
    CreateSessionUseCase,
    LoginRepository,
    LoginValidator,
)
from services.telegram_auth import TelegramLinkUseCase, TelegramLoginUseCase

router = APIRouter(prefix="/tg-auth", tags=["telegram_auth"])


def build_session_response(content: dict, session_id: str, role: str) -> JSONResponse:
    "Отдаёт ответ с cookie сессии и роли — те же параметры, что у обычного входа."
    response = JSONResponse(content=content)
    for key, value in (("session_id", session_id), ("user_role", role)):
        response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=SESSION_COOKIE_MAX_AGE_SECONDS,
            path="/",
        )
    return response


@router.post("/telegram")
async def telegram_login(
    body: TelegramAuthRequest,
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    "Вход по Telegram initData: автологин если tg привязан, иначе linked=false."
    repo = LoginRepository(db)
    user = await TelegramLoginUseCase(repo).execute(body.init_data)
    if user is None:
        return JSONResponse(content={"linked": False})
    session = await CreateSessionUseCase(repo).execute(user.id)
    return build_session_response(
        {"linked": True, "role": user.role.value}, session.session_id, user.role.value
    )


@router.post("/telegram/link")
async def telegram_link(
    body: TelegramLinkRequest,
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    "Привязка Telegram к существующему аккаунту (email+пароль) → cookie-сессия."
    repo = LoginRepository(db)
    user = await TelegramLinkUseCase(repo, LoginValidator()).execute(
        body.init_data, body.email, body.password, body.role
    )
    session = await CreateSessionUseCase(repo).execute(user.id)
    return build_session_response(
        {"linked": True, "role": user.role.value}, session.session_id, user.role.value
    )
