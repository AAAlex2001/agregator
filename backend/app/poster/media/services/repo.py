"""Запросы к файлам постов."""

from datetime import datetime

from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.media.models import PostMedia
from models.account import Account


class PostMediaRepository:
    """Доступ к таблице post_media."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_for_update(self, media_id: int) -> PostMedia | None:
        """Файл под блокировкой: публикация не займёт его, пока он удаляется."""

        stmt = select(PostMedia).where(PostMedia.id == media_id).with_for_update()

        return await self.db.scalar(stmt)

    async def count_free(self, owner_id: int) -> int:
        """Сколько файлов пользователь загрузил и ещё не привязал.

        Загрузки одного владельца идут по очереди: строка аккаунта блокируется.
        """

        lock = select(Account.id).where(Account.id == owner_id).with_for_update(key_share=True)
        await self.db.execute(lock)

        stmt = (
            select(func.count())
            .where(PostMedia.owner_id == owner_id)
            .where(PostMedia.post_id.is_(None))
        )

        return await self.db.scalar(stmt) or 0

    async def list_attachable(
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
        files = await self.db.scalars(stmt)

        return list(files)

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
        stmt = delete(PostMedia).where(PostMedia.id.in_(expired)).returning(PostMedia.path)
        paths = await self.db.scalars(stmt)

        return list(paths)

    async def add(self, media: PostMedia) -> PostMedia:
        """Сохраняет загруженный файл."""

        self.db.add(media)
        await self.db.flush()

        return media

    async def delete(self, media: PostMedia) -> None:
        """Удаляет запись о файле."""

        await self.db.delete(media)
        await self.db.flush()
