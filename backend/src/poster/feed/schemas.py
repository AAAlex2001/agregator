from datetime import datetime

from pydantic import BaseModel


class SitemapItemResponse(BaseModel):
    """Пост в карте сайта: id, автор и когда изменён."""

    id: int
    author_id: int
    updated_at: datetime


class UnseenCountResponse(BaseModel):
    """Сколько новых постов в подписках."""

    count: int
