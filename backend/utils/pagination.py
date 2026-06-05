"""
Утилиты пагинации без COUNT(*): запрашиваем `limit + 1` записей, режем последнюю
и по факту наличия отрезанной записи отдаём `has_more`.
"""
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession


async def paginate_with_has_more[T](
    db: AsyncSession,
    query: Select[tuple[T]],
    skip: int,
    limit: int,
) -> tuple[list[T], bool]:
    "Выполняет query.offset(skip).limit(limit + 1), возвращает (items[:limit], has_more)."
    rows = (await db.execute(query.offset(skip).limit(limit + 1))).scalars().unique().all()
    items = list(rows)
    has_more = len(items) > limit
    return items[:limit], has_more
