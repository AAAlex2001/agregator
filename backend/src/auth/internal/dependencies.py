import secrets
from typing import Annotated

from fastapi import Header

from src.auth.internal.exceptions import InternalTokenInvalidError, InternalTokenMissingError
from src.core.config import get_settings


async def require_internal_token(x_internal_token: Annotated[str, Header()]) -> None:
    """Пропускает только запросы админки: заголовок X-Internal-Token должен совпасть с секретом сервера."""
    expected_token = get_settings().internal_api_token

    if not expected_token:
        raise InternalTokenMissingError()

    if not secrets.compare_digest(x_internal_token, expected_token):
        raise InternalTokenInvalidError()
