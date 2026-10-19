"""Каналы: репозиторий, запросы к Telegram, фабрики сценариев и свой канал по id."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import require_user
from app.core.database import get_db
from app.core.telegram import TelegramApi, get_telegram_api
from app.poster.channels.models import PosterChannel
from app.poster.channels.services.exceptions import ChannelNotFoundError
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import TelegramChats
from app.poster.channels.services.usecases.disconnect_channel import DisconnectChannelUseCase
from app.poster.channels.services.usecases.refresh_channel import RefreshChannelUseCase
from models.account import Account


def get_channel_repository(db: AsyncSession = Depends(get_db)) -> ChannelRepository:
    """Подключённые каналы с сессией текущего запроса."""

    return ChannelRepository(db)


def get_telegram_chats(api: TelegramApi = Depends(get_telegram_api)) -> TelegramChats:
    """Запросы к Telegram о чатах."""

    return TelegramChats(api)


def get_refresh_channel_usecase(
    channels: ChannelRepository = Depends(get_channel_repository),
    chats: TelegramChats = Depends(get_telegram_chats),
) -> RefreshChannelUseCase:
    """Сценарий обновления канала."""

    return RefreshChannelUseCase(channels, chats)


def get_disconnect_channel_usecase(
    channels: ChannelRepository = Depends(get_channel_repository),
    chats: TelegramChats = Depends(get_telegram_chats),
) -> DisconnectChannelUseCase:
    """Сценарий отключения канала."""

    return DisconnectChannelUseCase(channels, chats)


async def get_own_channel(
    channel_id: int,
    user: Account = Depends(require_user),
    channels: ChannelRepository = Depends(get_channel_repository),
) -> PosterChannel:
    """Свой канал по id из пути. Чужой выглядит как несуществующий — 404."""

    channel = await channels.get_for_owner(channel_id, user.id)
    if channel is None:
        raise ChannelNotFoundError

    return channel
