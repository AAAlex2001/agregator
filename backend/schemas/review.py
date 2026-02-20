from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class CreateReviewRequest(BaseModel):
    response_id: int = Field(..., gt=0)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(default="", max_length=5000)


class CreateReviewResponse(BaseModel):
    detail: str


class ReviewItem(BaseModel):
    id: int
    order_title: str
    company_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    reviews: List[ReviewItem]
    total: int
    avg_rating: float
