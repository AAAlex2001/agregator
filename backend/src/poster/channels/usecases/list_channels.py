from src.accounts.models import Account
from src.poster.channels.repository import ChannelRepository
from src.poster.channels.schemas import ChannelResponse


class ListChannelsUseCase:
    """Список своих подключённых каналов."""

    def __init__(self, channels: ChannelRepository) -> None:
        """Принимает репозиторий каналов."""
        self.channels = channels

    async def execute(self, *, user: Account) -> list[ChannelResponse]:
        """Возвращает каналы пользователя в порядке подключения."""
        channels = await self.channels.list_for_owner(user.id)

        return [ChannelResponse.model_validate(channel) for channel in channels]
