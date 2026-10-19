"""Запросы к подключённым каналам."""

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.channels.models import PosterChannel


class ChannelRepository:
    """Доступ к таблице poster_channels."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_owner(self, owner_id: int) -> list[PosterChannel]:
        """Каналы владельца по порядку подключения."""

        stmt = select(PosterChannel).where(PosterChannel.owner_id == owner_id).order_by(PosterChannel.id)
        channels = await self.db.scalars(stmt)

        return list(channels)

    async def list_ready(self, owner_id: int, channel_ids: list[int]) -> list[PosterChannel]:
        """Каналы владельца из списка, в которые бот может публиковать."""

        stmt = select(PosterChannel).where(
            PosterChannel.owner_id == owner_id,
            PosterChannel.id.in_(channel_ids),
            PosterChannel.is_active.is_(True),
            PosterChannel.can_post.is_(True),
        )
        channels = await self.db.scalars(stmt)

        return list(channels)

    async def list_by_chat(self, chat_id: int) -> list[PosterChannel]:
        """Все подключения одного чата у разных владельцев."""

        channels = await self.db.scalars(select(PosterChannel).where(PosterChannel.chat_id == chat_id))

        return list(channels)

    async def get_for_owner(self, channel_id: int, owner_id: int) -> PosterChannel | None:
        """Своё подключение по id или None."""

        stmt = select(PosterChannel).where(
            PosterChannel.id == channel_id,
            PosterChannel.owner_id == owner_id,
        )

        return await self.db.scalar(stmt)

    async def find(self, owner_id: int, chat_id: int) -> PosterChannel | None:
        """Подключение этого чата у владельца или None."""

        stmt = select(PosterChannel).where(
            PosterChannel.owner_id == owner_id,
            PosterChannel.chat_id == chat_id,
        )

        return await self.db.scalar(stmt)

    async def count_by_chat(self, chat_id: int) -> int:
        """Сколько владельцев подключили этот чат."""

        stmt = select(func.count()).where(PosterChannel.chat_id == chat_id)

        return await self.db.scalar(stmt) or 0

    async def move_chat(self, old_chat_id: int, new_chat_id: int) -> None:
        """Группа стала супергруппой: у неё новый id."""

        stmt = (
            update(PosterChannel)
            .where(PosterChannel.chat_id == old_chat_id)
            .values(chat_id=new_chat_id)
            .execution_options(synchronize_session=False)
        )

        await self.db.execute(stmt)

    async def add(self, channel: PosterChannel) -> None:
        """Сохраняет новое подключение."""

        self.db.add(channel)
        await self.db.flush()

    async def save(self) -> None:
        """Записывает изменения подключений."""

        await self.db.flush()

    async def delete(self, channel: PosterChannel) -> None:
        """Удаляет подключение вместе с его доставками."""

        await self.db.delete(channel)
        await self.db.flush()
