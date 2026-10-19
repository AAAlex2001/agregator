"""Отключение канала."""

from app.poster.channels.models import PosterChannel
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import TelegramChats


class DisconnectChannelUseCase:
    """Удаляет подключение. Если чат больше никто не подключал, бот из него выходит."""

    def __init__(self, channels: ChannelRepository, chats: TelegramChats) -> None:
        self.channels = channels
        self.chats = chats

    async def execute(self, channel: PosterChannel) -> None:
        """Посты в канале остаются, бот перестаёт туда публиковать."""

        chat_id = channel.chat_id
        await self.channels.delete(channel)

        if await self.channels.count_by_chat(chat_id) == 0:
            await self.chats.leave(chat_id)
