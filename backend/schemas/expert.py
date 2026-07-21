from datetime import datetime

from pydantic import BaseModel, Field

from schemas.order import OrderResponse


class ExpertCertificate(BaseModel):
    "Одно удостоверение эксперта: область аттестации + объект экспертизы + категория."
    area: str = Field(..., max_length=20, description="Область аттестации, напр. 'Э12'")
    object: str = Field(..., max_length=20, description="Объект экспертизы, напр. 'ТУ'")
    category: str = Field(..., max_length=5, description="Категория, напр. '3'")
    expires_at: str | None = Field(None, max_length=30, description="Срок действия удостоверения")


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
    certificates: list[str] | None = None
    certificate_codes: list[str] = Field(default_factory=list)
    phone: str | None = None
    email: str | None = None


class ExpertMapResponse(BaseModel):
    "Список экспертов с координатами — для карты при создании заказа."
    items: list[ExpertMapItem]
