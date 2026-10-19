"""Ссылка на бота в ответах API."""

from pydantic import BaseModel, Field


class TelegramLinkSchema(BaseModel):
    """Куда перейти, чтобы привязать Telegram и подключить каналы."""

    url: str = Field(..., description="Ссылка t.me на бота с одноразовым токеном")
