"""Репозитории комментариев: post_comments и post_comment_likes. Коммитит общий get_db."""

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.posts import CommentLike, Post, PostComment


class PostCommentRepository:
    """Доступ к таблице post_comments."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, comment_id: int) -> PostComment | None:
        """Комментарий по id или None."""

        return await self.db.get(PostComment, comment_id)

    async def list_roots(self, post_id: int, limit: int, offset: int) -> tuple[list[PostComment], int]:
        """Корневые комментарии поста по порядку написания и сколько всего веток."""

        conditions = [PostComment.post_id == post_id, PostComment.parent_id.is_(None)]
        stmt = select(PostComment).where(*conditions).order_by(PostComment.created_at, PostComment.id)
        items = (await self.db.execute(stmt.limit(limit).offset(offset))).unique().scalars().all()
        total = await self.db.scalar(select(func.count()).select_from(PostComment).where(*conditions))
        return list(items), total or 0

    async def list_replies(self, root_ids: list[int]) -> list[PostComment]:
        """Ответы в ветках этих корневых комментариев по порядку написания."""

        stmt = (
            select(PostComment)
            .where(PostComment.parent_id.in_(root_ids))
            .order_by(PostComment.created_at, PostComment.id)
        )
        return list((await self.db.execute(stmt)).unique().scalars().all())

    async def add(self, comment: PostComment) -> PostComment:
        """Сохраняет комментарий и пересчитывает комментарии поста."""

        self.db.add(comment)
        await self.db.flush()
        await self.refresh_count(comment.post_id)
        return await self.reload(comment.id)

    async def update_text(self, comment: PostComment, text: str) -> PostComment:
        """Меняет текст комментария."""

        comment.text = text
        await self.db.flush()
        return await self.reload(comment.id)

    async def delete(self, comment: PostComment) -> None:
        """Удаляет комментарий вместе с веткой и пересчитывает комментарии поста."""

        post_id = comment.post_id
        await self.db.delete(comment)
        await self.db.flush()
        await self.refresh_count(post_id)

    async def refresh_count(self, post_id: int) -> None:
        """Пересчитывает комментарии поста под блокировкой его строки."""

        await self.db.execute(select(Post.id).where(Post.id == post_id).with_for_update(no_key=True))
        count = select(func.count()).where(PostComment.post_id == post_id).scalar_subquery()
        stmt = update(Post).where(Post.id == post_id).values(comments_count=count)
        await self.db.execute(stmt.execution_options(synchronize_session=False))

    async def refresh_likes(self, comment_id: int) -> int:
        """Пересчитывает лайки комментария под блокировкой его строки и возвращает их число."""

        lock = select(PostComment.id).where(PostComment.id == comment_id).with_for_update(no_key=True)
        await self.db.execute(lock)
        count = select(func.count()).where(CommentLike.comment_id == comment_id).scalar_subquery()
        stmt = (
            update(PostComment)
            .where(PostComment.id == comment_id)
            .values(likes_count=count)
            .returning(PostComment.likes_count)
        )
        return await self.db.scalar(stmt.execution_options(synchronize_session=False)) or 0

    async def reload(self, comment_id: int) -> PostComment:
        """Перечитывает комментарий вместе с автором и тем, кому ответ."""

        stmt = (
            select(PostComment).where(PostComment.id == comment_id).execution_options(populate_existing=True)
        )
        return (await self.db.execute(stmt)).unique().scalar_one()


class CommentLikeRepository:
    """Доступ к таблице post_comment_likes. Пара пользователь–комментарий уникальна."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, user_id: int, comment_id: int) -> None:
        """Ставит лайк. Повторный ничего не меняет."""

        await self.db.execute(
            insert(CommentLike).values(user_id=user_id, comment_id=comment_id).on_conflict_do_nothing()
        )

    async def remove(self, user_id: int, comment_id: int) -> None:
        """Убирает лайк."""

        await self.db.execute(
            delete(CommentLike).where(CommentLike.user_id == user_id, CommentLike.comment_id == comment_id)
        )

    async def liked_ids(self, user_id: int, comment_ids: list[int]) -> set[int]:
        """Какие комментарии из списка пользователь лайкнул."""

        stmt = select(CommentLike.comment_id).where(
            CommentLike.user_id == user_id, CommentLike.comment_id.in_(comment_ids)
        )
        return set((await self.db.execute(stmt)).scalars().all())
