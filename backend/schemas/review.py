from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from schemas.order import OrderDocuments


class CreateReviewRequest(BaseModel):
    "Payload создания отзыва клиента на исполнителя по принятому отклику."
    response_id: int = Field(..., gt=0)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(default="", max_length=5000)


class ReviewBadgeItem(BaseModel):
    "Бейдж заказа, отображаемый в карточке отзыва."
    text: str
    variant: str


class ReviewItem(BaseModel):
    "Карточка отзыва в списке: данные заказа + рейтинг + комментарий."
    id: int
    order_title: str
    company_name: str
    order_sum: str = ""
    order_start_date: str = ""
    order_deadline: str = ""
    expert_start_date: str = ""
    expert_deadline: str = ""
    expert_sum: str = ""
    order_documents: OrderDocuments = Field(default_factory=OrderDocuments)
    badges: list[ReviewBadgeItem] = Field(default_factory=list)
    rating: int
    comment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewListResponse(BaseModel):
    "Постраничный список отзывов с агрегатами (средний рейтинг, всего отзывов)."
    reviews: list[ReviewItem]
    has_more: bool
    total_reviews: int
    avg_rating: float


class PublicExpertReviewsResponse(BaseModel):
    "Публичная страница отзывов эксперта: его карточка + отзывы + агрегаты."
    expert_public_id: str
    expert_name: str
    expert_avatar_url: str | None = None
    reviews: list[ReviewItem]
    has_more: bool
    total_reviews: int
    avg_rating: float
