"""Доставки и предпросмотр Telegram-поста в API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.poster.channels.schemas import ChannelSchema
from app.poster.delivery.models import DeliveryStatus
from app.poster.media.models import MAX_POST_MEDIA
from app.poster.publications.models import MAX_POST_HTML


class DeliverySchema(BaseModel):
    """Пост в одном канале: статус, ошибка и когда ушёл."""

    model_config = ConfigDict(from_attributes=True)

    channel: ChannelSchema = Field(..., description="Канал или группа")
    status: DeliveryStatus = Field(..., description="Ждёт, отправляется, отправлен, ошибка или удалён")
    error: str | None = Field(None, description="Почему не получилось")
    sent_at: datetime | None = Field(None, description="Когда вышел в Telegram")
    message_url: str | None = Field(None, description="Ссылка на пост в Telegram")


class TelegramPreviewRequestSchema(BaseModel):
    """Текст из редактора и сколько к нему фото и видео."""

    html: str = Field("", max_length=MAX_POST_HTML, description="Текст из редактора в HTML")
    media_count: int = Field(0, ge=0, le=MAX_POST_MEDIA, description="Сколько фото и видео")


class TelegramPreviewSchema(BaseModel):
    """Как пост выглядит в Telegram и влезает ли он в лимит."""

    html: str = Field(..., description="Текст в разметке Telegram")
    length: int = Field(..., description="Длина видимого текста, как её считает Telegram")
    limit: int = Field(..., description="4096 для текста, 1024 для подписи к медиа")
