from datetime import datetime
from enum import StrEnum
from typing import Annotated, Literal, Self

from pydantic import BaseModel, Field, model_validator

from src.poster.channels.schemas import ChannelResponse
from src.poster.delivery.models import DeliveryStatus, PostDelivery


class ButtonKind(StrEnum):
    """Что делает кнопка: открывает ссылку, копирует текст или показывает скрытый текст."""

    URL = "url"
    COPY = "copy"
    HIDDEN = "hidden"


class LinkPreview(StrEnum):
    """Превью ссылки в посте: как решит Telegram, без превью, маленькое или большое."""

    AUTO = "auto"
    OFF = "off"
    SMALL = "small"
    LARGE = "large"


class TelegramButton(BaseModel):
    """Кнопка под постом: ссылка, копирование текста или скрытый текст для подписчиков."""

    kind: ButtonKind
    text: str = Field(min_length=1, max_length=64)
    value: str = Field(min_length=1, max_length=512)
    alt: str = Field(default="", max_length=200)
    style: Literal["primary", "success", "danger"] | None = None

    @model_validator(mode="after")
    def check_value(self) -> Self:
        """Проверяет value по правилам Telegram для каждого вида кнопки."""
        if self.kind == ButtonKind.URL and not self.value.startswith(("https://", "http://")):
            raise ValueError("Ссылка на кнопке должна начинаться с https://")

        if self.kind == ButtonKind.COPY and len(self.value) > 256:
            raise ValueError("Текст для копирования — не длиннее 256 символов")

        if self.kind == ButtonKind.HIDDEN and len(self.value) > 200:
            raise ValueError("Скрытый текст — не длиннее 200 символов")

        return self


class TelegramPoll(BaseModel):
    """Опрос, который бот отправляет следом за постом."""

    question: str = Field(min_length=1, max_length=300)
    options: list[Annotated[str, Field(min_length=1, max_length=100)]] = Field(min_length=2, max_length=10)
    is_anonymous: bool = True
    allows_multiple_answers: bool = False


class TelegramOptions(BaseModel):
    """Как пост выходит в Telegram. Хранится в поле posts.telegram."""

    silent: bool = False
    protect: bool = False
    pin: bool = False
    link_preview: LinkPreview = LinkPreview.AUTO
    link_preview_above: bool = False
    caption_above: bool = False
    auto_delete_hours: Literal[1, 6, 24, 48, 168] | None = None
    buttons: list[Annotated[list[TelegramButton], Field(min_length=1, max_length=3)]] = Field(
        default_factory=list,
        max_length=8,
    )
    poll: TelegramPoll | None = None


class DeliveryResponse(BaseModel):
    """Пост в одном канале: как идёт отправка и ссылка на сообщение."""

    channel: ChannelResponse
    status: DeliveryStatus
    error: str | None
    sent_at: datetime | None
    message_url: str | None

    @classmethod
    def from_delivery(cls, delivery: PostDelivery) -> "DeliveryResponse":
        """Собирает ответ из доставки и её канала."""
        return cls(
            channel=ChannelResponse.model_validate(delivery.channel),
            status=DeliveryStatus(delivery.status),
            error=delivery.error,
            sent_at=delivery.sent_at,
            message_url=message_url(delivery),
        )


def message_url(delivery: PostDelivery) -> str | None:
    """Возвращает ссылку на отправленный пост в Telegram или None."""
    if delivery.status != DeliveryStatus.SENT or not delivery.message_ids:
        return None

    message_id = delivery.message_ids[0]
    channel = delivery.channel

    if channel.username:
        return f"https://t.me/{channel.username}/{message_id}"

    chat_id = str(channel.chat_id)

    if not chat_id.startswith("-100"):
        return None

    return f"https://t.me/c/{chat_id.removeprefix('-100')}/{message_id}"
