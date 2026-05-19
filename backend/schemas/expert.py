from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from schemas.order import OrderResponse


class ExpertSummary(BaseModel):
    "Карточка эксперта без контактов: данные публичного профиля + агрегаты + последний выполненный заказ."

    public_id: str
    full_name: str
    avatar_url: str | None = None
    rating: float | None = None
    review_count: int = 0
    completed_orders_count: int = 0
    joined_at: datetime
    last_order: Optional[OrderResponse] = None


class ExpertListResponse(BaseModel):
    items: List[ExpertSummary]
    has_more: bool
