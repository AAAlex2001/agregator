"Общая логика visitor-key: анонимный идентификатор в cookie для голосов/комментариев без аккаунта."

from uuid import uuid4

from fastapi import Cookie, Response

VISITOR_COOKIE = "visitor_id"
VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365


def get_visitor_key(
    response: Response,
    raw_cookie: str | None = Cookie(None, alias=VISITOR_COOKIE),
) -> str:
    "Читает cookie visitor_id, при отсутствии выставляет новый. Возвращает 'anon:<uuid>'."
    visitor_id = raw_cookie if raw_cookie and len(raw_cookie) <= 64 else uuid4().hex
    if visitor_id != raw_cookie:
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
    "Единый ключ идентичности для реакций/комментариев: user:<id> для авторизованных, иначе visitor_key."
    return f"user:{user_id}" if user_id is not None else visitor_key
