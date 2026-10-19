"""Подключение канала или группы из бота."""

from dataclasses import dataclass

from app.poster.channels.models import PosterChannel
from app.poster.channels.services.exceptions import (
    BotNotInChatError,
    NotChatAdminError,
    TelegramNotLinkedError,
)
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import TelegramChats
from app.telegram.link.services.repo import TelegramLinkRepository


@dataclass(frozen=True)
class ConnectResult:
    """Подключение и стало ли оно рабочим только что: тогда бот сообщает об успехе."""

    channel: PosterChannel
    became_ready: bool


class ConnectChannelUseCase:
    """Подключает чат к аккаунту того, кто его выбрал или добавил бота.

    Подключить может только администратор чата: это проверяется у Telegram.
    """

    def __init__(
        self,
        channels: ChannelRepository,
        links: TelegramLinkRepository,
        chats: TelegramChats,
    ) -> None:
        self.channels = channels
        self.links = links
        self.chats = chats

    async def execute(self, telegram_user_id: int, chat_id: int) -> ConnectResult:
        """Telegram не привязан, не администратор или бота нет в чате — ошибка с текстом для бота."""

        owner = await self.links.find_by_telegram(telegram_user_id)
        if owner is None:
            raise TelegramNotLinkedError

        if not await self.chats.is_admin(chat_id, telegram_user_id):
            raise NotChatAdminError

        info = await self.chats.inspect(chat_id)
        if info is None:
            raise BotNotInChatError

        channel = await self.channels.find(owner.id, chat_id)
        if channel is None:
            channel = PosterChannel(owner_id=owner.id, chat_id=chat_id)
            info.apply_to(channel)
            await self.channels.add(channel)
            return ConnectResult(channel=channel, became_ready=channel.is_ready)

        was_ready = channel.is_ready
        info.apply_to(channel)
        await self.channels.save()

        return ConnectResult(channel=channel, became_ready=channel.is_ready and not was_ready)
