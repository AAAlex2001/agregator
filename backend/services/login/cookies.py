"Выставление auth-cookie сессии и роли — одинаковые параметры во всех сценариях входа."
from fastapi import Response

from services.login.repository import SESSION_COOKIE_MAX_AGE_SECONDS


def set_session_cookie(
    response: Response, session_id: str, max_age: int = SESSION_COOKIE_MAX_AGE_SECONDS
) -> None:
    "Выставляет cookie сессии."
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=max_age,
        path="/",
    )


def set_role_cookie(
    response: Response, role: str, max_age: int = SESSION_COOKIE_MAX_AGE_SECONDS
) -> None:
    "Выставляет cookie активной роли."
    response.set_cookie(
        key="user_role",
        value=role,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=max_age,
        path="/",
    )


def set_session_cookies(
    response: Response,
    session_id: str,
    role: str,
    max_age: int = SESSION_COOKIE_MAX_AGE_SECONDS,
) -> None:
    "Выставляет обе auth-cookie: сессию и роль."
    set_session_cookie(response, session_id, max_age)
    set_role_cookie(response, role, max_age)
