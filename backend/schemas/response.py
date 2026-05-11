import json
from datetime import date, datetime
from enum import Enum as PyEnum
from typing import Any

from pydantic import BaseModel, Field, field_validator

from models.response import ResponseStatus, VatKind
from schemas.order import OrderDocuments


class ResponseTab(str, PyEnum):
    ALL = "all"
    REVIEW = "review"
    IN_PROGRESS = "in_progress"
    REJECTED = "rejected"
    ACCEPTED = "accepted"


class ResponseCreate(BaseModel):
    comment: str = Field(default="", max_length=5000)
    proposed_sum_amount: int = Field(..., gt=0)
    proposed_deadline: date
    expert_inn: str | None = Field(default=None, min_length=10, max_length=12)
    expert_company_data: dict[str, Any] | None = None
    vat_kind: VatKind = VatKind.NONE

    @field_validator("expert_company_data", mode="before")
    @classmethod
    def _parse_company_data(cls, value: Any) -> Any:
        if value is None or isinstance(value, dict):
            return value
        if isinstance(value, str):
            if not value:
                return None
            try:
                parsed = json.loads(value)
            except (ValueError, TypeError) as exc:
                raise ValueError("Некорректные данные компании") from exc
            if not isinstance(parsed, dict):
                raise ValueError("Некорректные данные компании")
            return parsed
        raise ValueError("Некорректные данные компании")


class ResponseCounters(BaseModel):
    all: int = 0
    review: int = 0
    in_progress: int = 0
    rejected: int = 0
    accepted: int = 0


class ExpertResponseItem(BaseModel):
    id: int
    order_id: int
    order_public_id: str = ""
    order_customer_id: int = 0
    status: ResponseStatus
    date: str
    comment: str
    proposed_sum: str
    proposed_deadline: str
    order_title: str
    order_sum: str
    order_date: str
    order_comment: str = ""
    customer_name: str
    customer_company: str
    order_documents: OrderDocuments = Field(default_factory=OrderDocuments)
    response_files: list[str] = []
    badges: list[dict[str, str]]
    created_at: datetime
    proposed_sum_amount_raw: int = 0
    proposed_deadline_raw: str = ""
    previous_comment: str | None = None
    previous_proposed_sum: str | None = None
    previous_proposed_deadline: str | None = None
    previous_vat_kind: VatKind | None = None
    previous_response_files: list[str] | None = None
    order_previous_title: str | None = None
    order_previous_comment: str | None = None
    order_previous_sum: str | None = None
    order_previous_date: str | None = None
    order_previous_documents: OrderDocuments | None = None
    order_previous_badges: list[dict[str, str]] | None = None
    expert_name: str = ""
    expert_avatar_url: str | None = None
    expert_rating: float | None = None
    expert_review_count: int = 0
    expert_public_id: str = ""
    confirm_deadline: str = ""
    expert_confirmed: bool = False
    has_review: bool = False
    rejection_reason: str | None = None
    expert_company_name: str = ""
    expert_inn: str | None = None
    vat_kind: VatKind = VatKind.NONE
    order_locked: bool = False

    model_config = {"from_attributes": True}


class ExpertResponseList(BaseModel):
    items: list[ExpertResponseItem]
    has_more: bool
    counters: ResponseCounters
