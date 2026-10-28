from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.channels.dependencies import (
    get_disconnect_channel_usecase,
    get_list_channels_usecase,
    get_refresh_channel_usecase,
)
from src.poster.channels.schemas import ChannelResponse
from src.poster.channels.usecases.disconnect_channel import DisconnectChannelUseCase
from src.poster.channels.usecases.list_channels import ListChannelsUseCase
from src.poster.channels.usecases.refresh_channel import RefreshChannelUseCase

router = APIRouter(prefix="/poster/channels", tags=["Каналы"])


@router.get("", response_model=list[ChannelResponse])
async def list_channels(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListChannelsUseCase, Depends(get_list_channels_usecase)],
) -> list[ChannelResponse]:
    """Возвращает мои подключённые каналы и группы."""
    return await usecase.execute(user=user)


@router.post("/{channel_id}/refresh", response_model=ChannelResponse)
async def refresh_channel(
    channel_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[RefreshChannelUseCase, Depends(get_refresh_channel_usecase)],
) -> ChannelResponse:
    """Перечитывает у Telegram название канала, участников и права бота."""
    return await usecase.execute(user=user, channel_id=channel_id)


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_channel(
    channel_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[DisconnectChannelUseCase, Depends(get_disconnect_channel_usecase)],
) -> None:
    """Отключает мой канал."""
    await usecase.execute(user=user, channel_id=channel_id)
