"""Репозиторий подписок на авторов: post_follows и отметка просмотра вкладки «Подписки»."""

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account
from models.posts import Follow


class FollowRepository:
    """Доступ к таблице post_follows. Пара подписчик–автор уникальна."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, follower_id: int, author_id: int) -> bool:
        """Подписывает. False — подписка уже была."""

        stmt = insert(Follow).values(follower_id=follower_id, author_id=author_id).on_conflict_do_nothing()
        return await self.db.scalar(stmt.returning(Follow.author_id)) is not None

    async def remove(self, follower_id: int, author_id: int) -> None:
        """Отписывает."""

        await self.db.execute(
            delete(Follow).where(Follow.follower_id == follower_id, Follow.author_id == author_id)
        )

    async def following_ids(self, follower_id: int, author_ids: list[int]) -> set[int]:
        """На кого из авторов пользователь подписан."""

        stmt = select(Follow.author_id).where(
            Follow.follower_id == follower_id, Follow.author_id.in_(author_ids)
        )
        return set((await self.db.execute(stmt)).scalars().all())

    async def mark_feed_seen(self, user_id: int) -> None:
        """Вкладка «Подписки» просмотрена: новые посты считаются с этого момента."""

        stmt = update(Account).where(Account.id == user_id).values(following_seen_at=func.now())
        await self.db.execute(stmt.execution_options(synchronize_session=False))
