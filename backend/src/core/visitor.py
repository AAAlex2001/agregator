from typing import Annotated
from uuid import uuid4

from fastapi import Cookie, Response

VISITOR_COOKIE = "visitor_id"
ONE_YEAR_SECONDS = 60 * 60 * 24 * 365


def get_visitor_id(
    response: Response,
    visitor_id: Annotated[str | None, Cookie(alias=VISITOR_COOKIE, max_length=64)] = None,
) -> str:
    """Возвращает id гостя из cookie, а если cookie нет — выдаёт новый на год."""
    if visitor_id is None:
        visitor_id = uuid4().hex
        response.set_cookie(VISITOR_COOKIE, visitor_id, max_age=ONE_YEAR_SECONDS, httponly=True)

    return visitor_id
