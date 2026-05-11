from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from schemas.order import OrderDocuments


class CreateReviewRequest(BaseModel):
    response_id: int = Field(..., gt=0)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(default="", max_length=5000)


class CreateReviewResponse(BaseModel):
    detail: str


class ReviewBadgeItem(BaseModel):
    text: str
    variant: str


class ReviewItem(BaseModel):
    id: int
    order_title: str
    company_name: str
    order_sum: str = ""
    order_deadline: str = ""
    expert_deadline: str = ""
    expert_sum: str = ""
    order_documents: OrderDocuments = Field(default_factory=OrderDocuments)
    badges: List[ReviewBadgeItem] = Field(default_factory=list)
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    reviews: List[ReviewItem]
    has_more: bool
    total_reviews: int
    avg_rating: float


class PublicExpertReviewsResponse(BaseModel):
    expert_public_id: str
    expert_name: str
    expert_avatar_url: str | None = None
    reviews: List[ReviewItem]
    has_more: bool
    total_reviews: int
    avg_rating: float
