"""Доступ админ-сервиса: заголовок X-Internal-Token должен совпасть с секретом сервера."""

import secrets

from fastapi import Depends, Header

from app.core.config import Settings, get_settings
from app.core.errors import AppError


class InternalTokenMissingError(AppError):
    """Секрет не задан на сервере — внутренние ручки выключены."""

    status_code = 503
    message = "INTERNAL_API_TOKEN не настроен на сервере"


class InternalTokenInvalidError(AppError):
    """Заголовок не совпал с секретом."""

    status_code = 401
    message = "Неверный internal token"


async def require_internal_token(
    x_internal_token: str = Header(...),
    settings: Settings = Depends(get_settings),
) -> None:
    """Пропускает только запросы админ-сервиса."""

    if not settings.internal_api_token:
        raise InternalTokenMissingError

    if not secrets.compare_digest(x_internal_token, settings.internal_api_token):
        raise InternalTokenInvalidError
