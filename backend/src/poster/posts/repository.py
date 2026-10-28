from datetime import datetime

from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.posts.models import Post, PostMedia, PostStatus


class PostRepository:
    """Читает и записывает посты."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get(self, post_id: int) -> Post | None:
        """Возвращает пост по id или None."""
        query = select(Post).where(Post.id == post_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def reload(self, post: Post) -> Post:
        """Перечитывает пост из базы: доставки и счётчики могли поменяться отдельными запросами."""
        await self.db.refresh(post)

        return post

    async def get_published(self, post_id: int) -> Post | None:
        """Возвращает пост, который опубликован на сайте, или None."""
        query = select(Post).where(
            Post.id == post_id,
            Post.status == PostStatus.PUBLISHED,
            Post.on_site.is_(True),
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def get_visible(self, post_id: int, viewer_id: int | None) -> Post | None:
        """Возвращает пост, если его можно показать этому человеку, иначе None."""
        is_public = (Post.status == PostStatus.PUBLISHED) & Post.on_site.is_(True)
        query = select(Post).where(Post.id == post_id, or_(is_public, Post.author_id == viewer_id))
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def get_for_author(self, post_id: int, author_id: int) -> Post | None:
        """Возвращает пост автора по id или None, если поста нет или он чужой."""
        query = select(Post).where(Post.id == post_id, Post.author_id == author_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_by_status(
        self,
        status: PostStatus,
        author_id: int | None,
        limit: int,
        offset: int,
    ) -> list[Post]:
        """Возвращает посты в одном статусе, новые первыми. Можно оставить посты одного автора."""
        query = (
            select(Post)
            .where(Post.status == status)
            .order_by(Post.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        if author_id is not None:
            query = query.where(Post.author_id == author_id)

        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_by_status(self, status: PostStatus, author_id: int | None) -> int:
        """Считает посты в одном статусе. Можно посчитать посты одного автора."""
        query = select(func.count()).select_from(Post).where(Post.status == status)

        if author_id is not None:
            query = query.where(Post.author_id == author_id)

        result = await self.db.execute(query)

        return result.scalar_one()

    async def change_likes_count(self, post_id: int, delta: int) -> int:
        """Меняет счётчик лайков прямо в базе и возвращает новое значение."""
        query = (
            update(Post)
            .where(Post.id == post_id)
            .values(likes_count=Post.likes_count + delta)
            .returning(Post.likes_count)
        )
        result = await self.db.execute(query)

        return result.scalar_one()

    async def change_comments_count(self, post_id: int, delta: int) -> None:
        """Меняет счётчик комментариев прямо в базе."""
        query = (
            update(Post)
            .where(Post.id == post_id)
            .values(comments_count=Post.comments_count + delta)
        )
        await self.db.execute(query)

    async def add_view(self, post_id: int) -> None:
        """Прибавляет посту один просмотр прямо в базе."""
        query = (
            update(Post)
            .where(Post.id == post_id)
            .values(views_count=Post.views_count + 1)
        )
        await self.db.execute(query)

    async def change_reposts_count(self, post_id: int, delta: int) -> None:
        """Меняет счётчик репостов прямо в базе: +1 или −1."""
        query = (
            update(Post)
            .where(Post.id == post_id)
            .values(reposts_count=Post.reposts_count + delta)
        )
        await self.db.execute(query)

    async def publish_scheduled(self, now: datetime) -> None:
        """Публикует отложенные посты, время которых наступило."""
        query = (
            update(Post)
            .where(Post.status == PostStatus.SCHEDULED, Post.scheduled_at <= now)
            .values(status=PostStatus.PUBLISHED, published_at=now, scheduled_at=None)
        )
        await self.db.execute(query)

    async def add(self, post: Post) -> None:
        """Сохраняет новый пост в базе."""
        self.db.add(post)
        await self.db.flush()

    async def save(self) -> None:
        """Сохраняет изменения постов в базе."""
        await self.db.flush()

    async def delete(self, post: Post) -> None:
        """Удаляет пост из базы. Его файлы и доставки база удаляет сама."""
        await self.db.delete(post)
        await self.db.flush()


class MediaRepository:
    """Читает и записывает фото и видео постов."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def list_free(
        self,
        owner_id: int,
        media_ids: list[int],
        post_id: int | None,
    ) -> list[PostMedia]:
        """Возвращает файлы автора, которые можно прикрепить к посту."""
        query = select(PostMedia).where(
            PostMedia.owner_id == owner_id,
            PostMedia.id.in_(media_ids),
            or_(PostMedia.post_id.is_(None), PostMedia.post_id == post_id),
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def get_free(self, media_id: int, owner_id: int) -> PostMedia | None:
        """Возвращает свой файл, который ещё не прикреплён к посту, или None."""
        query = select(PostMedia).where(
            PostMedia.id == media_id,
            PostMedia.owner_id == owner_id,
            PostMedia.post_id.is_(None),
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def count_free(self, owner_id: int) -> int:
        """Считает файлы автора, которые ещё не прикреплены к посту."""
        query = select(func.count()).where(
            PostMedia.owner_id == owner_id,
            PostMedia.post_id.is_(None),
        )
        result = await self.db.execute(query)

        return result.scalar_one()

    async def add(self, media: PostMedia) -> None:
        """Сохраняет запись о новом файле в базе."""
        self.db.add(media)
        await self.db.flush()

    async def delete(self, media: PostMedia) -> None:
        """Удаляет запись о файле из базы."""
        await self.db.delete(media)
        await self.db.flush()

    async def delete_unused(self, created_before: datetime) -> list[str]:
        """Удаляет записи о брошенных файлах и возвращает их пути."""
        query = (
            delete(PostMedia)
            .where(PostMedia.post_id.is_(None), PostMedia.created_at < created_before)
            .returning(PostMedia.path)
        )
        result = await self.db.execute(query)

        return list(result.scalars())
