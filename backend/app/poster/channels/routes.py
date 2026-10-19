"""Свои Telegram-каналы и группы: список, обновление, отключение.

Подключение идёт через бота: ссылку на него отдаёт POST /telegram/link.
"""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import require_user
from app.poster.channels.dependencies import (
    get_channel_repository,
    get_disconnect_channel_usecase,
    get_own_channel,
    get_refresh_channel_usecase,
)
from app.poster.channels.models import PosterChannel
from app.poster.channels.schemas import ChannelSchema
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.usecases.disconnect_channel import DisconnectChannelUseCase
from app.poster.channels.services.usecases.refresh_channel import RefreshChannelUseCase
from models.account import Account

router = APIRouter(prefix="/poster/channels", tags=["poster"])


@router.get("")
async def list_channels(
    user: Account = Depends(require_user),
    channels: ChannelRepository = Depends(get_channel_repository),
) -> list[ChannelSchema]:
    """Свои каналы и группы по порядку подключения."""

    items = await channels.list_for_owner(user.id)

    return [ChannelSchema.model_validate(item) for item in items]


@router.post("/{channel_id}/refresh")
async def refresh_channel(
    channel: PosterChannel = Depends(get_own_channel),
    usecase: RefreshChannelUseCase = Depends(get_refresh_channel_usecase),
) -> ChannelSchema:
    """Перечитать название, участников и права бота."""

    refreshed = await usecase.execute(channel=channel)

    return ChannelSchema.model_validate(refreshed)


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_channel(
    channel: PosterChannel = Depends(get_own_channel),
    usecase: DisconnectChannelUseCase = Depends(get_disconnect_channel_usecase),
) -> None:
    """Отключить канал. Уже вышедшие посты в нём остаются."""

    await usecase.execute(channel=channel)
