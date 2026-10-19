"""Права бота в чате изменились: его добавили, повысили, понизили или удалили."""

from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import GONE_STATUSES, TelegramChats


class UpdateChatAccessUseCase:
    """Обновляет все подключения чата сразу, чтобы публикация не упала на устаревших правах."""

    def __init__(self, channels: ChannelRepository, chats: TelegramChats) -> None:
        self.channels = channels
        self.chats = chats

    async def execute(self, chat_id: int, bot_status: str) -> None:
        """Бот ушёл из чата — подключения выключаются, иначе перечитываются права."""

        connected = await self.channels.list_by_chat(chat_id)
        if not connected:
            return

        info = None if bot_status in GONE_STATUSES else await self.chats.inspect(chat_id)

        for channel in connected:
            if info is None:
                channel.is_active = False
                channel.can_post = False
            else:
                info.apply_to(channel)

        await self.channels.save()
