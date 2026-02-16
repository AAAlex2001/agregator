from datetime import date, datetime
from enum import Enum as PyEnum

from pydantic import BaseModel, Field

from models.response import ResponseStatus


class ResponseTab(str, PyEnum):
    ALL = "all"
    REVIEW = "review"
    REJECTED = "rejected"
    ACCEPTED = "accepted"
    COMPLETED = "completed"
    ARCHIVE = "archive"


class ResponseCreate(BaseModel):
    comment: str = Field(default="", max_length=5000)
    proposed_sum_amount: int = Field(..., gt=0)
    proposed_deadline: date


class ResponseCounters(BaseModel):
    all: int = 0
    review: int = 0
    rejected: int = 0
    accepted: int = 0
    completed: int = 0
    archive: int = 0


class ExpertResponseItem(BaseModel):
    id: int
    order_id: int
    status: ResponseStatus
    date: str
    comment: str
    proposed_sum: str
    proposed_deadline: str
    order_title: str
    order_sum: str
    order_date: str
    customer_name: str
    customer_company: str
    technical_files: list[str]
    response_files: list[str] = []
    badges: list[dict[str, str]]
    created_at: datetime
    order_commission_amount: str = ""
    commission_paid: str | None = None
    balance_return: str | None = None

    model_config = {"from_attributes": True}


class ExpertResponseList(BaseModel):
    items: list[ExpertResponseItem]
    total: int
    counters: ResponseCounters
