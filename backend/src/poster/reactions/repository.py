from datetime import date

from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.reactions.models import PostLike, PostSave, PostView


class ReactionRepository:
    """Записывает лайки, сохранения и просмотры постов."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def like(self, user_id: int, post_id: int) -> bool:
        """Ставит лайк. Возвращает True, если лайка раньше не было."""
        query = (
            insert(PostLike)
            .values(user_id=user_id, post_id=post_id)
            .on_conflict_do_nothing()
            .returning(PostLike.post_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None

    async def unlike(self, user_id: int, post_id: int) -> bool:
        """Снимает лайк. Возвращает True, если лайк был."""
        query = (
            delete(PostLike)
            .where(PostLike.user_id == user_id, PostLike.post_id == post_id)
            .returning(PostLike.post_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None

    async def save(self, user_id: int, post_id: int) -> None:
        """Добавляет пост в сохранённые. Если он уже там — ничего не делает."""
        query = insert(PostSave).values(user_id=user_id, post_id=post_id).on_conflict_do_nothing()
        await self.db.execute(query)

    async def unsave(self, user_id: int, post_id: int) -> None:
        """Убирает пост из сохранённых."""
        query = delete(PostSave).where(PostSave.user_id == user_id, PostSave.post_id == post_id)
        await self.db.execute(query)

    async def add_view(self, post_id: int, visitor: str, day: date) -> bool:
        """Записывает просмотр. Возвращает True, если сегодня этот посетитель смотрит пост впервые."""
        query = (
            insert(PostView)
            .values(post_id=post_id, visitor=visitor, viewed_on=day)
            .on_conflict_do_nothing()
            .returning(PostView.post_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None
