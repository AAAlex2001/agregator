from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.core.telegram import TelegramClient, get_telegram
from src.poster.channels.repository import ChannelRepository
from src.poster.channels.telegram_chats import TelegramChats
from src.poster.channels.usecases.disconnect_channel import DisconnectChannelUseCase
from src.poster.channels.usecases.list_channels import ListChannelsUseCase
from src.poster.channels.usecases.refresh_channel import RefreshChannelUseCase


def get_list_channels_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListChannelsUseCase:
    """Собирает сценарий списка каналов."""
    return ListChannelsUseCase(ChannelRepository(db))


def get_refresh_channel_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    telegram: Annotated[TelegramClient, Depends(get_telegram)],
) -> RefreshChannelUseCase:
    """Собирает сценарий обновления канала."""
    return RefreshChannelUseCase(ChannelRepository(db), TelegramChats(telegram))


def get_disconnect_channel_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    telegram: Annotated[TelegramClient, Depends(get_telegram)],
) -> DisconnectChannelUseCase:
    """Собирает сценарий отключения канала."""
    return DisconnectChannelUseCase(ChannelRepository(db), TelegramChats(telegram))
