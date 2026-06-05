"""
Утилиты пагинации без COUNT(*): запрашиваем `limit + 1` записей, режем последнюю
и по факту наличия отрезанной записи отдаём `has_more`.
"""
from typing import TypeVar

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


async def paginate_with_has_more(
    db: AsyncSession,
    query: Select,
    skip: int,
    limit: int,
) -> tuple[list[T], bool]:
    "Выполняет query.offset(skip).limit(limit + 1), возвращает (items[:limit], has_more)."
    rows = (await db.execute(query.offset(skip).limit(limit + 1))).scalars().unique().all()
    items = list(rows)
    has_more = len(items) > limit
    return items[:limit], has_more
