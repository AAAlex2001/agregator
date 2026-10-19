"""Обновление сведений о канале по кнопке на сайте."""

from app.poster.channels.models import PosterChannel
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import TelegramChats


class RefreshChannelUseCase:
    """Перечитывает название, участников и права бота."""

    def __init__(self, channels: ChannelRepository, chats: TelegramChats) -> None:
        self.channels = channels
        self.chats = chats

    async def execute(self, channel: PosterChannel) -> PosterChannel:
        """Бот больше не видит чат — подключение выключается."""

        info = await self.chats.inspect(channel.chat_id)

        if info is None:
            channel.is_active = False
            channel.can_post = False
        else:
            info.apply_to(channel)

        await self.channels.save()

        return channel
