from datetime import datetime
from typing import List

from pydantic import BaseModel


class ExpertSummary(BaseModel):
    "Карточка эксперта без контактов: данные публичного профиля + агрегированная статистика."

    public_id: str
    full_name: str
    avatar_url: str | None = None
    rating: float | None = None
    review_count: int = 0
    completed_orders_count: int = 0
    joined_at: datetime


class ExpertListResponse(BaseModel):
    items: List[ExpertSummary]
    has_more: bool
