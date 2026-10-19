"""Запросы лент: «Для вас», подписки, автор, свои посты, репосты, сохранённое, карта сайта."""

from datetime import datetime

from sqlalchemy import ColumnElement, Select, and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.follows.models import Follow
from app.poster.publications.models import Post, PostStatus
from app.poster.reactions.models import PostSave

MAX_SITEMAP_POSTS = 50000

VISIBLE_REPOST = or_(
    Post.repost_of_id.is_(None),
    Post.repost_of.has(status=PostStatus.PUBLISHED, on_site=True),
)
ON_SITE = [Post.status == PostStatus.PUBLISHED, Post.on_site.is_(True)]
NEWEST_FIRST = (
    func.coalesce(Post.published_at, Post.created_at).desc(),
    Post.id.desc(),
)


class FeedRepository:
    """Чтение постов списками. В ленты сайта не попадают посты только для Telegram и репосты скрытых."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def page(
        self,
        stmt: Select[tuple[Post]],
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Страница по запросу и сколько постов всего."""

        result = await self.db.execute(stmt.limit(limit).offset(offset))
        total = await self.db.scalar(select(func.count()).select_from(stmt.order_by(None).subquery()))

        return list(result.unique().scalars()), total or 0

    async def page_newest(
        self,
        conditions: list[ColumnElement[bool]],
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Видимые посты по условиям, новые первыми."""

        stmt = select(Post).where(*conditions, VISIBLE_REPOST).order_by(*NEWEST_FIRST)

        return await self.page(stmt, limit, offset)

    async def list_published(self, limit: int, offset: int) -> tuple[list[Post], int]:
        """Лента «Для вас»: опубликованные посты и репосты всех авторов."""

        return await self.page_newest(ON_SITE, limit, offset)

    async def list_following(self, user_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Лента «Подписки»: посты и репосты авторов, вышедшие после подписки на них.

        Отписка удаляет подписку — и посты автора уходят из ленты.
        """

        following = and_(Follow.author_id == Post.author_id, Follow.follower_id == user_id)
        stmt = (
            select(Post)
            .join(Follow, following)
            .where(*ON_SITE, Post.published_at > Follow.created_at, VISIBLE_REPOST)
            .order_by(*NEWEST_FIRST)
        )

        return await self.page(stmt, limit, offset)

    async def list_by_author(self, author_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Опубликованные оригиналы автора — для его страницы."""

        conditions = [*ON_SITE, Post.author_id == author_id, Post.repost_of_id.is_(None)]

        return await self.page_newest(conditions, limit, offset)

    async def list_own(
        self,
        author_id: int,
        status: PostStatus,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Свои оригиналы в одном состоянии: публикации, черновики или скрытые."""

        conditions = [
            Post.author_id == author_id,
            Post.status == status,
            Post.repost_of_id.is_(None),
        ]

        return await self.page_newest(conditions, limit, offset)

    async def list_reposts(self, author_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Свои репосты."""

        conditions = [
            Post.author_id == author_id,
            Post.status == PostStatus.PUBLISHED,
            Post.repost_of_id.is_not(None),
        ]

        return await self.page_newest(conditions, limit, offset)

    async def list_saved(self, user_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Сохранённые посты, недавно сохранённые первыми."""

        stmt = (
            select(Post)
            .join(PostSave, PostSave.post_id == Post.id)
            .where(PostSave.user_id == user_id, *ON_SITE, VISIBLE_REPOST)
            .order_by(PostSave.created_at.desc(), PostSave.post_id.desc())
        )

        return await self.page(stmt, limit, offset)

    async def count_following_since(self, user_id: int, since: datetime | None) -> int:
        """Сколько постов вышло у авторов из подписок после since и после подписки на автора."""

        conditions = [
            *ON_SITE,
            Follow.follower_id == user_id,
            Post.published_at > Follow.created_at,
            VISIBLE_REPOST,
        ]
        if since is not None:
            conditions.append(Post.published_at > since)

        stmt = (
            select(func.count())
            .select_from(Post)
            .join(Follow, Follow.author_id == Post.author_id)
            .where(*conditions)
        )

        return await self.db.scalar(stmt) or 0

    async def list_sitemap(self) -> list[tuple[int, int, datetime]]:
        """id, автор и дата изменения опубликованных оригиналов — для карты сайта."""

        stmt = (
            select(Post.id, Post.author_id, Post.updated_at)
            .where(*ON_SITE, Post.repost_of_id.is_(None))
            .order_by(Post.id)
            .limit(MAX_SITEMAP_POSTS)
        )
        result = await self.db.execute(stmt)

        return list(result.tuples())
