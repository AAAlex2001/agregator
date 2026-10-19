"""Страница списка из параметров запроса."""

from dataclasses import dataclass

from fastapi import Query

MAX_PAGE_LIMIT = 1000


@dataclass
class PageQuery:
    """Сколько записей взять и сколько пропустить."""

    limit: int = Query(20, ge=1, le=MAX_PAGE_LIMIT)
    offset: int = Query(0, ge=0)
