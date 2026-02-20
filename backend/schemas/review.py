from pydantic import BaseModel, Field


class CreateReviewRequest(BaseModel):
    response_id: int = Field(..., gt=0)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(default="", max_length=5000)


class CreateReviewResponse(BaseModel):
    detail: str
