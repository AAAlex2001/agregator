"""Ленты в ответах API."""

from datetime import datetime

from pydantic import BaseModel, Field


class PostSitemapItemSchema(BaseModel):
    """Публикация, её автор и дата изменения для карты сайта."""

    id: int
    author_id: int
    updated_at: datetime


class UnseenSchema(BaseModel):
    """Сколько новых постов в подписках с прошлого захода во вкладку."""

    count: int = Field(..., description="Новых постов")
