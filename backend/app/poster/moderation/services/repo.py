"""Посты для модератора."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.publications.models import Post, PostStatus


class ModerationRepository:
    """Посты любого автора в одном состоянии, в том числе репосты скрытых оригиналов."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_posts(
        self,
        status: PostStatus,
        author_id: int | None,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Страница постов, новые первыми, и сколько их всего."""

        conditions = [Post.status == status]
        if author_id is not None:
            conditions.append(Post.author_id == author_id)

        stmt = (
            select(Post)
            .where(*conditions)
            .order_by(Post.created_at.desc(), Post.id.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(stmt)
        total = await self.db.scalar(select(func.count()).select_from(Post).where(*conditions))

        return list(result.unique().scalars()), total or 0
