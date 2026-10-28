from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.channels.models import PosterChannel


class ChannelRepository:
    """Читает и записывает подключённые каналы."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def list_for_owner(self, owner_id: int) -> list[PosterChannel]:
        """Возвращает каналы автора в порядке подключения."""
        query = (
            select(PosterChannel)
            .where(PosterChannel.owner_id == owner_id)
            .order_by(PosterChannel.id)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def get_for_owner(self, channel_id: int, owner_id: int) -> PosterChannel | None:
        """Возвращает канал автора по id или None, если его нет или он чужой."""
        query = select(PosterChannel).where(
            PosterChannel.id == channel_id,
            PosterChannel.owner_id == owner_id,
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_ready(self, owner_id: int, channel_ids: list[int]) -> list[PosterChannel]:
        """Возвращает каналы автора из списка, в которые бот сейчас может публиковать."""
        query = select(PosterChannel).where(
            PosterChannel.owner_id == owner_id,
            PosterChannel.id.in_(channel_ids),
            PosterChannel.is_active.is_(True),
            PosterChannel.can_post.is_(True),
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def find(self, owner_id: int, chat_id: int) -> PosterChannel | None:
        """Возвращает подключение этого чата у автора или None."""
        query = select(PosterChannel).where(
            PosterChannel.owner_id == owner_id,
            PosterChannel.chat_id == chat_id,
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_by_chat(self, chat_id: int) -> list[PosterChannel]:
        """Возвращает все подключения одного чата: его могли подключить несколько админов."""
        query = select(PosterChannel).where(PosterChannel.chat_id == chat_id)
        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_by_chat(self, chat_id: int) -> int:
        """Считает, сколько авторов подключили этот чат."""
        query = select(func.count()).where(PosterChannel.chat_id == chat_id)
        result = await self.db.execute(query)

        return result.scalar_one()

    async def move_chat(self, old_chat_id: int, new_chat_id: int) -> None:
        """Переносит подключения на новый id чата. Так бывает, когда группа становится супергруппой."""
        query = (
            update(PosterChannel)
            .where(PosterChannel.chat_id == old_chat_id)
            .values(chat_id=new_chat_id)
        )
        await self.db.execute(query)

    async def add(self, channel: PosterChannel) -> None:
        """Сохраняет новый канал в базе."""
        self.db.add(channel)
        await self.db.flush()

    async def save(self) -> None:
        """Сохраняет изменения каналов в базе."""
        await self.db.flush()

    async def delete(self, channel: PosterChannel) -> None:
        """Удаляет канал из базы."""
        await self.db.delete(channel)
        await self.db.flush()
