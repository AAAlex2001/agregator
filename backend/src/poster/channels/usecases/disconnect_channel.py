from contextlib import suppress

from src.accounts.models import Account
from src.core.telegram import TelegramError
from src.poster.channels.exceptions import ChannelNotFoundError
from src.poster.channels.repository import ChannelRepository
from src.poster.channels.telegram_chats import TelegramChats


class DisconnectChannelUseCase:
    """Отключение своего канала. Посты, которые уже вышли в канале, остаются там."""

    def __init__(self, channels: ChannelRepository, chats: TelegramChats) -> None:
        """Принимает каналы и запросы к Telegram о чатах."""
        self.channels = channels
        self.chats = chats

    async def execute(self, *, user: Account, channel_id: int) -> None:
        """Удаляет канал. Если чат больше никому не нужен, бот из него выходит."""
        channel = await self.channels.get_for_owner(channel_id, user.id)

        if channel is None:
            raise ChannelNotFoundError()

        chat_id = channel.chat_id
        await self.channels.delete(channel)

        if await self.channels.count_by_chat(chat_id) > 0:
            return

        with suppress(TelegramError):
            await self.chats.leave(chat_id)
