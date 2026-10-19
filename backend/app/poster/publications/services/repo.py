"""Запросы к постам. Коммит делает сессия запроса."""

from datetime import datetime

from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.media.models import PostMedia
from app.poster.publications.models import Post, PostStatus


async def lock_post(db: AsyncSession, post_id: int) -> None:
    """Блокирует строку поста до конца транзакции: счётчики пересчитываются по очереди."""

    stmt = select(Post.id).where(Post.id == post_id).with_for_update(key_share=True)

    await db.execute(stmt)


class PostRepository:
    """Доступ к таблице posts."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, post_id: int) -> Post | None:
        """Пост по id или None."""

        return await self.db.get(Post, post_id)

    async def get_for_update(self, post_id: int) -> Post:
        """Свежая версия поста под блокировкой: правка автора не затрёт решение модератора."""

        await lock_post(self.db, post_id)

        return await self.reload(post_id)

    async def publish_due(self, now: datetime) -> int:
        """Отложенные посты, чьё время пришло, становятся опубликованными. Сколько их вышло."""

        stmt = (
            update(Post)
            .where(Post.status == PostStatus.SCHEDULED, Post.scheduled_at <= now)
            .values(status=PostStatus.PUBLISHED, published_at=now, updated_at=now)
            .returning(Post.id)
            .execution_options(synchronize_session=False)
        )
        published = await self.db.scalars(stmt)

        return len(list(published))

    async def media_paths(self, post_id: int) -> list[str]:
        """Файлы поста и его репостов: они удаляются вместе с оригиналом."""

        stmt = (
            select(PostMedia.path)
            .join(Post, Post.id == PostMedia.post_id)
            .where(or_(Post.id == post_id, Post.repost_of_id == post_id))
        )
        paths = await self.db.scalars(stmt)

        return list(paths)

    async def add(self, post: Post) -> Post:
        """Сохраняет новый пост вместе с файлами."""

        self.db.add(post)
        await self.db.flush()

        return await self.reload(post.id)

    async def save(self, post: Post) -> Post:
        """Сохраняет изменения поста."""

        await self.db.flush()

        return await self.reload(post.id)

    async def delete(self, post: Post) -> None:
        """Удаляет пост с файлами, лайками, комментариями и репостами."""

        await self.db.delete(post)
        await self.db.flush()

    async def reload(self, post_id: int) -> Post:
        """Перечитывает пост вместе с автором, файлами и оригиналом."""

        stmt = select(Post).where(Post.id == post_id).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)

        return result.unique().scalar_one()
