from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.comments.models import CommentLike, PostComment


class CommentRepository:
    """Читает и записывает комментарии и их лайки."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get(self, comment_id: int) -> PostComment | None:
        """Возвращает комментарий по id или None."""
        query = select(PostComment).where(PostComment.id == comment_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def get_for_author(self, comment_id: int, author_id: int) -> PostComment | None:
        """Возвращает комментарий автора по id или None, если его нет или он чужой."""
        query = select(PostComment).where(
            PostComment.id == comment_id,
            PostComment.author_id == author_id,
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def reload(self, comment: PostComment) -> PostComment:
        """Перечитывает комментарий из базы вместе с тем, на что он ответ."""
        await self.db.refresh(comment)

        return comment

    async def list_roots(self, post_id: int, limit: int, offset: int) -> list[PostComment]:
        """Возвращает первые комментарии веток под постом, старые первыми."""
        query = (
            select(PostComment)
            .where(PostComment.post_id == post_id, PostComment.parent_id.is_(None))
            .order_by(PostComment.created_at, PostComment.id)
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_roots(self, post_id: int) -> int:
        """Считает ветки комментариев под постом."""
        query = select(func.count()).where(
            PostComment.post_id == post_id,
            PostComment.parent_id.is_(None),
        )
        result = await self.db.execute(query)

        return result.scalar_one()

    async def list_replies(self, root_ids: list[int]) -> list[PostComment]:
        """Возвращает все ответы в этих ветках, старые первыми."""
        query = (
            select(PostComment)
            .where(PostComment.parent_id.in_(root_ids))
            .order_by(PostComment.created_at, PostComment.id)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_replies(self, root_id: int) -> int:
        """Считает ответы в ветке."""
        query = select(func.count()).where(PostComment.parent_id == root_id)
        result = await self.db.execute(query)

        return result.scalar_one()

    async def list_liked_ids(self, user_id: int, comment_ids: list[int]) -> set[int]:
        """Возвращает id комментариев из списка, которые пользователь лайкнул."""
        query = select(CommentLike.comment_id).where(
            CommentLike.user_id == user_id,
            CommentLike.comment_id.in_(comment_ids),
        )
        result = await self.db.execute(query)

        return set(result.scalars())

    async def add(self, comment: PostComment) -> None:
        """Сохраняет новый комментарий в базе."""
        self.db.add(comment)
        await self.db.flush()

    async def save(self) -> None:
        """Сохраняет изменения комментариев в базе."""
        await self.db.flush()

    async def delete(self, comment: PostComment) -> None:
        """Удаляет комментарий. Ответы в его ветке база удаляет сама."""
        await self.db.delete(comment)
        await self.db.flush()

    async def like(self, user_id: int, comment_id: int) -> bool:
        """Ставит лайк комментарию. Возвращает True, если лайка раньше не было."""
        query = (
            insert(CommentLike)
            .values(user_id=user_id, comment_id=comment_id)
            .on_conflict_do_nothing()
            .returning(CommentLike.comment_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None

    async def unlike(self, user_id: int, comment_id: int) -> bool:
        """Снимает лайк с комментария. Возвращает True, если лайк был."""
        query = (
            delete(CommentLike)
            .where(CommentLike.user_id == user_id, CommentLike.comment_id == comment_id)
            .returning(CommentLike.comment_id)
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none() is not None

    async def change_likes_count(self, comment_id: int, delta: int) -> int:
        """Меняет счётчик лайков комментария прямо в базе и возвращает новое значение."""
        query = (
            update(PostComment)
            .where(PostComment.id == comment_id)
            .values(likes_count=PostComment.likes_count + delta)
            .returning(PostComment.likes_count)
        )
        result = await self.db.execute(query)

        return result.scalar_one()
