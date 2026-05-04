from datetime import datetime

from pydantic import BaseModel, Field


class QuestionAsk(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)


class QuestionUpdate(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)


class QuestionAnswer(BaseModel):
    answer: str = Field(..., min_length=1, max_length=2000)


class QuestionResponse(BaseModel):
    id: int
    order_id: int
    expert_id: int
    expert_name: str
    expert_avatar_url: str | None = None
    question: str
    answer: str | None = None
    asked_at: datetime
    answered_at: datetime | None = None

    model_config = {"from_attributes": True}


class QuestionListResponse(BaseModel):
    items: list[QuestionResponse]
    total: int
