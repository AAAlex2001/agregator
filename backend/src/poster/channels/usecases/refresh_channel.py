from src.accounts.models import Account
from src.core.telegram import TelegramError
from src.poster.channels.exceptions import ChannelNotFoundError
from src.poster.channels.repository import ChannelRepository
from src.poster.channels.schemas import ChannelResponse
from src.poster.channels.telegram_chats import TelegramChats


class RefreshChannelUseCase:
    """Обновление сведений о своём канале по кнопке на сайте."""

    def __init__(self, channels: ChannelRepository, chats: TelegramChats) -> None:
        """Принимает каналы и запросы к Telegram о чатах."""
        self.channels = channels
        self.chats = chats

    async def execute(self, *, user: Account, channel_id: int) -> ChannelResponse:
        """Перечитывает у Telegram название, участников и права бота в канале."""
        channel = await self.channels.get_for_owner(channel_id, user.id)

        if channel is None:
            raise ChannelNotFoundError()

        try:
            info = await self.chats.read(channel.chat_id)
            info.copy_to(channel)
        except TelegramError:
            channel.is_active = False
            channel.can_post = False

        await self.channels.save()

        return ChannelResponse.model_validate(channel)
