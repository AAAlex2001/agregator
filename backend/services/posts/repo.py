"""Репозитории публикаций: posts, post_media, post_likes, post_views и post_saves.

Коммитит общий get_db в конце запроса. Счётчики пересчитываются под блокировкой строки поста:
следующий запрос ждёт и считает уже с учётом закоммиченного предыдущего.
"""

from datetime import date, datetime

from sqlalchemy import ColumnElement, delete, func, or_, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account
from models.posts import Follow, Post, PostLike, PostMedia, PostSave, PostStatus, PostView

MAX_SITEMAP_POSTS = 50000

VISIBLE_REPOST = or_(
    Post.repost_of_id.is_(None),
    Post.repost_of.has(status=PostStatus.PUBLISHED),
)
NEWEST_FIRST = (
    func.coalesce(Post.published_at, Post.created_at).desc(),
    Post.id.desc(),
)


class PostRepository:
    """Доступ к таблице posts."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, post_id: int) -> Post | None:
        """Пост по id или None."""

        return await self.db.get(Post, post_id)

    async def lock(self, post_id: int) -> None:
        """Блокирует строку поста до конца транзакции."""

        stmt = (
            select(Post.id)
            .where(Post.id == post_id)
            .with_for_update(key_share=True)
        )
        await self.db.execute(stmt)

    async def get_for_update(self, post_id: int) -> Post:
        """Свежая версия поста под блокировкой: правка автора не затрёт решение модератора."""

        await self.lock(post_id)
        return await self.reload(post_id)

    async def page(
        self,
        conditions: list[ColumnElement[bool]],
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Страница видимых постов по условиям, новые первыми, и сколько их всего."""

        conditions = [*conditions, VISIBLE_REPOST]
        stmt = (
            select(Post)
            .where(*conditions)
            .order_by(*NEWEST_FIRST)
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(stmt)
        total = await self.db.scalar(
            select(func.count()).select_from(Post).where(*conditions)
        )
        return list(result.unique().scalars().all()), total or 0

    async def list_published(self, limit: int, offset: int) -> tuple[list[Post], int]:
        """Лента «Для вас»: опубликованные посты и репосты всех авторов."""

        conditions = [Post.status == PostStatus.PUBLISHED]
        return await self.page(conditions, limit, offset)

    async def list_following(
        self,
        user_id: int,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Лента «Подписки»: посты и репосты авторов, на которых подписан пользователь."""

        authors = select(Follow.author_id).where(Follow.follower_id == user_id)
        conditions = [
            Post.status == PostStatus.PUBLISHED,
            Post.author_id.in_(authors),
        ]
        return await self.page(conditions, limit, offset)

    async def list_by_author(
        self,
        author_id: int,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Опубликованные оригиналы автора — для его страницы."""

        conditions = [
            Post.author_id == author_id,
            Post.status == PostStatus.PUBLISHED,
            Post.repost_of_id.is_(None),
        ]
        return await self.page(conditions, limit, offset)

    async def list_for_author(
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
        return await self.page(conditions, limit, offset)

    async def list_reposts(
        self,
        author_id: int,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Свои репосты."""

        conditions = [
            Post.author_id == author_id,
            Post.status == PostStatus.PUBLISHED,
            Post.repost_of_id.is_not(None),
        ]
        return await self.page(conditions, limit, offset)

    async def list_saved(
        self,
        user_id: int,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Сохранённые посты, недавно сохранённые первыми, и сколько их всего."""

        conditions = [
            PostSave.user_id == user_id,
            Post.status == PostStatus.PUBLISHED,
            VISIBLE_REPOST,
        ]
        stmt = (
            select(Post)
            .join(PostSave, PostSave.post_id == Post.id)
            .where(*conditions)
            .order_by(PostSave.created_at.desc(), PostSave.post_id.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(stmt)
        total = await self.db.scalar(
            select(func.count())
            .select_from(Post)
            .join(PostSave, PostSave.post_id == Post.id)
            .where(*conditions)
        )
        return list(result.unique().scalars().all()), total or 0

    async def list_for_moderation(
        self,
        status: PostStatus,
        author_id: int | None,
        limit: int,
        offset: int,
    ) -> tuple[list[Post], int]:
        """Посты одного состояния для модератора, в том числе репосты скрытых оригиналов."""

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
        total = await self.db.scalar(
            select(func.count()).select_from(Post).where(*conditions)
        )
        return list(result.unique().scalars().all()), total or 0

    async def count_following_since(self, user_id: int, since: datetime | None) -> int:
        """Сколько постов вышло у авторов из подписок после since и после подписки на автора."""

        conditions = [
            Post.status == PostStatus.PUBLISHED,
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
            .where(Post.status == PostStatus.PUBLISHED)
            .where(Post.repost_of_id.is_(None))
            .order_by(Post.id)
            .limit(MAX_SITEMAP_POSTS)
        )
        result = await self.db.execute(stmt)
        return list(result.tuples().all())

    async def media_paths_for_delete(self, post_id: int) -> list[str]:
        """Файлы поста и его репостов: они удалятся вместе с оригиналом."""

        stmt = (
            select(PostMedia.path)
            .join(Post, Post.id == PostMedia.post_id)
            .where(or_(Post.id == post_id, Post.repost_of_id == post_id))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def refresh_likes(self, post_id: int) -> int:
        """Пересчитывает лайки поста и возвращает их число."""

        await self.lock(post_id)
        count = select(func.count()).where(PostLike.post_id == post_id).scalar_subquery()
        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(likes_count=count)
            .returning(Post.likes_count)
            .execution_options(synchronize_session=False)
        )
        return await self.db.scalar(stmt) or 0

    async def refresh_reposts(self, post_id: int) -> None:
        """Пересчитывает, сколько раз пост репостнули."""

        await self.lock(post_id)
        count = select(func.count()).where(Post.repost_of_id == post_id).scalar_subquery()
        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(reposts_count=count)
            .execution_options(synchronize_session=False)
        )
        await self.db.execute(stmt)

    async def add_view(self, post_id: int) -> None:
        """Прибавляет просмотр."""

        stmt = (
            update(Post)
            .where(Post.id == post_id)
            .values(views_count=Post.views_count + 1)
            .execution_options(synchronize_session=False)
        )
        await self.db.execute(stmt)

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
        """Удаляет пост с файлами, лайками и комментариями; у репоста пересчитывает оригинал."""

        original_id = post.repost_of_id
        await self.db.delete(post)
        await self.db.flush()
        if original_id is not None:
            await self.refresh_reposts(original_id)

    async def reload(self, post_id: int) -> Post:
        """Перечитывает пост вместе с автором, файлами и оригиналом."""

        stmt = (
            select(Post)
            .where(Post.id == post_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)
        return result.unique().scalar_one()


class PostMediaRepository:
    """Доступ к таблице post_media."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_for_update(self, media_id: int) -> PostMedia | None:
        """Файл под блокировкой: публикация не займёт его, пока он удаляется."""

        stmt = (
            select(PostMedia)
            .where(PostMedia.id == media_id)
            .with_for_update()
        )
        return await self.db.scalar(stmt)

    async def count_free(self, owner_id: int) -> int:
        """Сколько файлов пользователь загрузил и ещё не привязал.

        Загрузки одного владельца идут по очереди: строка аккаунта блокируется.
        """

        lock = (
            select(Account.id)
            .where(Account.id == owner_id)
            .with_for_update(key_share=True)
        )
        await self.db.execute(lock)

        stmt = (
            select(func.count())
            .where(PostMedia.owner_id == owner_id)
            .where(PostMedia.post_id.is_(None))
        )
        return await self.db.scalar(stmt) or 0

    async def list_usable(
        self,
        owner_id: int,
        media_ids: list[int],
        post_id: int | None,
    ) -> list[PostMedia]:
        """Файлы пользователя из списка: свободные или уже привязанные к этому посту."""

        allowed = PostMedia.post_id.is_(None)
        if post_id is not None:
            allowed = or_(allowed, PostMedia.post_id == post_id)

        stmt = (
            select(PostMedia)
            .where(PostMedia.id.in_(media_ids))
            .where(PostMedia.owner_id == owner_id)
            .where(allowed)
            .with_for_update()
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def delete_expired(self, before: datetime, limit: int) -> list[str]:
        """Удаляет порцию старых свободных файлов; занятые другой транзакцией пропускает."""

        expired = (
            select(PostMedia.id)
            .where(PostMedia.post_id.is_(None))
            .where(PostMedia.created_at < before)
            .order_by(PostMedia.created_at, PostMedia.id)
            .limit(limit)
            .with_for_update(skip_locked=True)
        )
        stmt = (
            delete(PostMedia)
            .where(PostMedia.id.in_(expired))
            .returning(PostMedia.path)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def add(self, media: PostMedia) -> PostMedia:
        """Сохраняет загруженный файл."""

        self.db.add(media)
        await self.db.flush()
        return media

    async def delete(self, media: PostMedia) -> None:
        """Удаляет запись о файле."""

        await self.db.delete(media)
        await self.db.flush()


class PostLikeRepository:
    """Доступ к таблице post_likes. Пара пользователь–пост уникальна."""

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

        stmt = (
            delete(PostLike)
            .where(PostLike.user_id == user_id)
            .where(PostLike.post_id == post_id)
        )
        await self.db.execute(stmt)

    async def liked_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Какие посты из списка пользователь лайкнул."""

        stmt = (
            select(PostLike.post_id)
            .where(PostLike.user_id == user_id)
            .where(PostLike.post_id.in_(post_ids))
        )
        result = await self.db.execute(stmt)
        return set(result.scalars().all())


class PostViewRepository:
    """Доступ к таблице post_views: один посетитель — один просмотр поста в сутки."""

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


class PostSaveRepository:
    """Доступ к таблице post_saves. Пара пользователь–пост уникальна."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, user_id: int, post_id: int) -> None:
        """Сохраняет пост. Повторное сохранение ничего не меняет."""

        stmt = (
            insert(PostSave)
            .values(user_id=user_id, post_id=post_id)
            .on_conflict_do_nothing()
        )
        await self.db.execute(stmt)

    async def remove(self, user_id: int, post_id: int) -> None:
        """Убирает пост из сохранённого."""

        stmt = (
            delete(PostSave)
            .where(PostSave.user_id == user_id)
            .where(PostSave.post_id == post_id)
        )
        await self.db.execute(stmt)

    async def saved_ids(self, user_id: int, post_ids: list[int]) -> set[int]:
        """Какие посты из списка пользователь сохранил."""

        stmt = (
            select(PostSave.post_id)
            .where(PostSave.user_id == user_id)
            .where(PostSave.post_id.in_(post_ids))
        )
        result = await self.db.execute(stmt)
        return set(result.scalars().all())
