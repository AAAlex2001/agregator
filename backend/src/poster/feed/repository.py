from datetime import datetime

from sqlalchemy import ColumnElement, Select, and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.follows.models import Follow
from src.poster.posts.models import Post, PostStatus
from src.poster.reactions.models import PostLike, PostSave

MAX_SITEMAP_POSTS = 50000

ON_SITE = (Post.status == PostStatus.PUBLISHED) & Post.on_site.is_(True)
ORIGINAL_ON_SITE = or_(
    Post.repost_of_id.is_(None),
    Post.repost_of.has(status=PostStatus.PUBLISHED, on_site=True),
)
NEWEST_FIRST = (func.coalesce(Post.published_at, Post.created_at).desc(), Post.id.desc())


class FeedRepository:
    """Достаёт посты для лент. Репосты постов, которых на сайте уже нет, в ленты не попадают."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def page(self, query: Select[tuple[Post]], limit: int, offset: int) -> tuple[list[Post], int]:
        """Возвращает одну страницу постов из запроса и сколько постов в нём всего."""
        posts_result = await self.db.execute(query.limit(limit).offset(offset))
        count_query = select(func.count()).select_from(query.order_by(None).subquery())
        total_result = await self.db.execute(count_query)

        return list(posts_result.scalars()), total_result.scalar_one()

    async def newest(
        self,
        conditions: list[ColumnElement[bool]],
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Возвращает страницу постов по условиям, новые первыми."""
        query = select(Post).where(*conditions, ORIGINAL_ON_SITE).order_by(*NEWEST_FIRST)

        return await self.page(query, limit, offset)

    async def list_published(self, limit: int, offset: int) -> tuple[list[Post], int]:
        """Лента «Для вас»: все посты на сайте."""
        return await self.newest([ON_SITE], limit, offset)

    async def list_by_author(self, author_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Посты автора на его странице, без репостов."""
        conditions = [ON_SITE, Post.author_id == author_id, Post.repost_of_id.is_(None)]

        return await self.newest(conditions, limit, offset)

    async def list_own(
        self,
        author_id: int,
        status: PostStatus,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Свои посты без репостов в одном состоянии: опубликованные, черновики, отложенные или скрытые."""
        conditions = [Post.author_id == author_id, Post.status == status, Post.repost_of_id.is_(None)]

        return await self.newest(conditions, limit, offset)

    async def list_reposts(self, author_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Свои опубликованные репосты."""
        conditions = [
            Post.author_id == author_id,
            Post.status == PostStatus.PUBLISHED,
            Post.repost_of_id.is_not(None),
        ]

        return await self.newest(conditions, limit, offset)

    async def list_following(self, user_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Посты авторов из подписок, вышедшие после того, как на них подписались."""
        query = (
            select(Post)
            .join(Follow, and_(Follow.author_id == Post.author_id, Follow.follower_id == user_id))
            .where(ON_SITE, Post.published_at > Follow.created_at, ORIGINAL_ON_SITE)
            .order_by(*NEWEST_FIRST)
        )

        return await self.page(query, limit, offset)

    async def list_saved(self, user_id: int, limit: int, offset: int) -> tuple[list[Post], int]:
        """Сохранённые посты: недавно сохранённые первыми."""
        query = (
            select(Post)
            .join(PostSave, PostSave.post_id == Post.id)
            .where(PostSave.user_id == user_id, ON_SITE, ORIGINAL_ON_SITE)
            .order_by(PostSave.created_at.desc(), PostSave.post_id.desc())
        )

        return await self.page(query, limit, offset)

    async def count_following_since(self, user_id: int, since: datetime | None) -> int:
        """Считает посты авторов из подписок, вышедшие после since."""
        query = (
            select(func.count())
            .select_from(Post)
            .join(Follow, Follow.author_id == Post.author_id)
            .where(
                Follow.follower_id == user_id,
                ON_SITE,
                Post.published_at > Follow.created_at,
                ORIGINAL_ON_SITE,
            )
        )

        if since is not None:
            query = query.where(Post.published_at > since)

        result = await self.db.execute(query)

        return result.scalar_one()

    async def list_sitemap(self) -> list[tuple[int, int, datetime]]:
        """Возвращает id, автора и дату изменения опубликованных постов для карты сайта."""
        query = (
            select(Post.id, Post.author_id, Post.updated_at)
            .where(ON_SITE, Post.repost_of_id.is_(None))
            .order_by(Post.id)
            .limit(MAX_SITEMAP_POSTS)
        )
        result = await self.db.execute(query)

        return list(result.tuples())

    async def list_liked_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Возвращает id постов из списка, которые пользователь лайкнул."""
        query = select(PostLike.post_id).where(PostLike.user_id == user_id, PostLike.post_id.in_(post_ids))
        result = await self.db.execute(query)

        return set(result.scalars())

    async def list_saved_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Возвращает id постов из списка, которые пользователь сохранил."""
        query = select(PostSave.post_id).where(PostSave.user_id == user_id, PostSave.post_id.in_(post_ids))
        result = await self.db.execute(query)

        return set(result.scalars())

    async def list_followed_ids(self, user_id: int, author_ids: list[int]) -> set[int]:
        """Возвращает id авторов из списка, на которых пользователь подписан."""
        query = select(Follow.author_id).where(
            Follow.follower_id == user_id,
            Follow.author_id.in_(author_ids),
        )
        result = await self.db.execute(query)

        return set(result.scalars())
