from datetime import datetime

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
    last_order: OrderResponse | None = None


class ExpertListResponse(BaseModel):
    "Постраничный ответ со списком публичных карточек экспертов."
    items: list[ExpertSummary]
    has_more: bool


class ExpertMapItem(BaseModel):
    "Эксперт с координатами базирования — точка на карте."
    public_id: str
    full_name: str
    avatar_url: str | None = None
    rating: float | None = None
    city: str | None = None
    lat: float
    lng: float
    travels_to_other_regions: bool = False


class ExpertMapResponse(BaseModel):
    "Список экспертов с координатами — для карты при создании заказа."
    items: list[ExpertMapItem]
