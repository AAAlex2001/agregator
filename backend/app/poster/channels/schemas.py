"""Подключённые каналы в ответах API."""

from pydantic import BaseModel, ConfigDict, Field

from app.poster.channels.models import ChannelKind


class ChannelSchema(BaseModel):
    """Канал или группа и может ли бот туда публиковать."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID подключения")
    kind: ChannelKind = Field(..., description="Канал, группа или супергруппа")
    title: str = Field(..., description="Название чата")
    username: str | None = Field(None, description="Публичное имя без @")
    members_count: int | None = Field(None, description="Сколько участников")
    can_post: bool = Field(..., description="У бота есть права на публикацию")
    is_active: bool = Field(..., description="Бот состоит в чате")
