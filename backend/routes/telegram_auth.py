from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.rate_limit import rate_limit
from schemas.telegram_auth import TelegramAuthRequest, TelegramLinkRequest
from services.login import (
    CreateSessionUseCase,
    LoginRepository,
    LoginValidator,
    set_session_cookies,
)
from services.telegram_auth import TelegramLinkUseCase, TelegramLoginUseCase

router = APIRouter(prefix="/tg-auth", tags=["telegram_auth"])


def build_session_response(content: dict, session_id: str, role: str) -> JSONResponse:
    "Отдаёт ответ с cookie сессии и роли — те же параметры, что у обычного входа."
    response = JSONResponse(content=content)
    set_session_cookies(response, session_id, role)
    return response


@router.post(
    "/telegram",
    dependencies=[Depends(rate_limit("tg_login", max_calls=10, window_seconds=60))],
)
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


@router.post(
    "/telegram/link",
    dependencies=[Depends(rate_limit("tg_link", max_calls=5, window_seconds=60))],
)
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
