"""Запросы к подпискам на авторов и к отметке просмотра вкладки «Подписки»."""

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.follows.models import Follow
from models.account import Account


class FollowRepository:
    """Доступ к таблице post_follows."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_author(self, author_id: int) -> Account | None:
        """Аккаунт автора или None."""

        return await self.db.get(Account, author_id)

    async def add(self, follower_id: int, author_id: int) -> bool:
        """Подписывает. False — подписка уже была."""

        stmt = (
            insert(Follow)
            .values(follower_id=follower_id, author_id=author_id)
            .on_conflict_do_nothing()
            .returning(Follow.author_id)
        )

        return await self.db.scalar(stmt) is not None

    async def remove(self, follower_id: int, author_id: int) -> None:
        """Отписывает."""

        stmt = delete(Follow).where(Follow.follower_id == follower_id, Follow.author_id == author_id)

        await self.db.execute(stmt)

    async def following_ids(self, follower_id: int, author_ids: list[int]) -> set[int]:
        """На кого из авторов пользователь подписан."""

        stmt = select(Follow.author_id).where(
            Follow.follower_id == follower_id,
            Follow.author_id.in_(author_ids),
        )
        ids = await self.db.scalars(stmt)

        return set(ids)

    async def mark_feed_seen(self, user_id: int) -> None:
        """Вкладка «Подписки» просмотрена: новые посты считаются с этого момента."""

        stmt = (
            update(Account)
            .where(Account.id == user_id)
            .values(following_seen_at=func.now())
            .execution_options(synchronize_session=False)
        )

        await self.db.execute(stmt)
