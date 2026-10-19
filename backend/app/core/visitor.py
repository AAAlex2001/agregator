"""Посетитель без аккаунта: случайный ключ в cookie для просмотров и реакций."""

from uuid import uuid4

from fastapi import Cookie, Response

VISITOR_COOKIE = "visitor_id"
VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
MAX_VISITOR_ID_LENGTH = 64


def get_visitor_key(
    response: Response,
    visitor_id: str | None = Cookie(None, alias=VISITOR_COOKIE),
) -> str:
    """Ключ посетителя anon:<id>. Cookie нет или она испорчена — выдаётся новая."""

    if not visitor_id or len(visitor_id) > MAX_VISITOR_ID_LENGTH:
        visitor_id = uuid4().hex
        response.set_cookie(
            VISITOR_COOKIE,
            visitor_id,
            max_age=VISITOR_COOKIE_MAX_AGE,
            httponly=True,
            samesite="lax",
            path="/",
        )

    return f"anon:{visitor_id}"


def interaction_key(user_id: int | None, visitor_key: str) -> str:
    """Кто действует: user:<id> для вошедшего, иначе ключ посетителя."""

    if user_id is None:
        return visitor_key

    return f"user:{user_id}"
