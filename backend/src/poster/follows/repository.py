from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.follows.models import Follow


class FollowRepository:
    """Читает и записывает подписки на авторов."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def follow(self, follower_id: int, author_id: int) -> bool:
        """Подписывает на автора. Возвращает True, если подписки раньше не было."""
        query = (
            insert(Follow)
            .values(follower_id=follower_id, author_id=author_id)
            .on_conflict_do_nothing()
            .returning(Follow.author_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None

    async def unfollow(self, follower_id: int, author_id: int) -> None:
        """Отписывает от автора."""
        query = delete(Follow).where(Follow.follower_id == follower_id, Follow.author_id == author_id)
        await self.db.execute(query)
