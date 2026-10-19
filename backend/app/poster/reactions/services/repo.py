"""Запросы к лайкам, просмотрам и сохранениям постов."""

from datetime import date

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.publications.models import Post
from app.poster.publications.services.repo import lock_post
from app.poster.reactions.models import PostLike, PostSave, PostView


class PostLikeRepository:
    """Доступ к таблице post_likes и счётчику likes_count."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, user_id: int, post_id: int) -> bool:
        """Ставит лайк. False — лайк уже стоял."""

        stmt = (
            insert(PostLike)
            .values(user_id=user_id, post_id=post_id)
            .on_conflict_do_nothing()
            .returning(PostLike.post_id)
        )

        return await self.db.scalar(stmt) is not None

    async def remove(self, user_id: int, post_id: int) -> None:
        """Убирает лайк."""

        stmt = delete(PostLike).where(PostLike.user_id == user_id, PostLike.post_id == post_id)

        await self.db.execute(stmt)

    async def liked_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Какие посты из списка пользователь лайкнул."""

        stmt = select(PostLike.post_id).where(
            PostLike.user_id == user_id,
            PostLike.post_id.in_(post_ids),
        )
        ids = await self.db.scalars(stmt)

        return set(ids)

    async def refresh_count(self, post_id: int) -> int:
        """Пересчитывает лайки поста под блокировкой его строки и возвращает их число."""

        await lock_post(self.db, post_id)

        count = select(func.count()).where(PostLike.post_id == post_id).scalar_subquery()
        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(likes_count=count)
            .returning(Post.likes_count)
            .execution_options(synchronize_session=False)
        )

        return await self.db.scalar(stmt) or 0


class PostViewRepository:
    """Доступ к таблице post_views и счётчику views_count."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add_once(self, post_id: int, visitor: str, day: date) -> bool:
        """Записывает просмотр за день. False — посетитель сегодня уже смотрел."""

        stmt = (
            insert(PostView)
            .values(post_id=post_id, visitor=visitor, viewed_on=day)
            .on_conflict_do_nothing()
            .returning(PostView.post_id)
        )

        return await self.db.scalar(stmt) is not None

    async def increment(self, post_id: int) -> None:
        """Прибавляет просмотр к счётчику поста."""

        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(views_count=Post.views_count + 1)
            .execution_options(synchronize_session=False)
        )

        await self.db.execute(stmt)


class PostSaveRepository:
    """Доступ к таблице post_saves."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, user_id: int, post_id: int) -> None:
        """Сохраняет пост. Повторное сохранение ничего не меняет."""

        stmt = insert(PostSave).values(user_id=user_id, post_id=post_id).on_conflict_do_nothing()

        await self.db.execute(stmt)

    async def remove(self, user_id: int, post_id: int) -> None:
        """Убирает пост из сохранённого."""

        stmt = delete(PostSave).where(PostSave.user_id == user_id, PostSave.post_id == post_id)

        await self.db.execute(stmt)

    async def saved_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Какие посты из списка пользователь сохранил."""

        stmt = select(PostSave.post_id).where(
            PostSave.user_id == user_id,
            PostSave.post_id.in_(post_ids),
        )
        ids = await self.db.scalars(stmt)

        return set(ids)
