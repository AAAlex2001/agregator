"""Счётчик репостов поста."""

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.publications.models import Post
from app.poster.publications.services.repo import lock_post


class RepostRepository:
    """Пересчёт reposts_count в таблице posts."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def refresh_count(self, post_id: int) -> None:
        """Пересчитывает, сколько раз пост репостнули."""

        await lock_post(self.db, post_id)

        count = select(func.count()).where(Post.repost_of_id == post_id).scalar_subquery()
        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(reposts_count=count)
            .execution_options(synchronize_session=False)
        )
        await self.db.execute(stmt)
