import json
from datetime import date, datetime
from enum import Enum as PyEnum

from pydantic import BaseModel, ConfigDict, Field, field_validator

from models.response import ResponseStatus, VatKind
from schemas.company import validate_company_data
from schemas.order import BadgeResponse, OrderDocuments


class ResponseTab(str, PyEnum):
    "Вкладка в списке откликов эксперта (фильтр по статусу)."
    ALL = "all"
    REVIEW = "review"
    IN_PROGRESS = "in_progress"
    REJECTED = "rejected"
    ACCEPTED = "accepted"
    WITHDRAWN_BY_EXPERT = "withdrawn_by_expert"


class ResponseCreate(BaseModel):
    "Payload отклика эксперта на заказ."
    comment: str = Field(default="", max_length=5000)
    proposed_sum_amount: int = Field(..., gt=0)
    proposed_start_date: date | None = None
    proposed_deadline: date
    expert_inn: str | None = Field(default=None, min_length=10, max_length=12)
    expert_company_data: dict[str, object] | None = None
    vat_kind: VatKind = VatKind.NONE

    @field_validator("expert_company_data", mode="before")
    @classmethod
    def parse_company_data(cls, value: object) -> object:
        if value is None:
            return None
        if isinstance(value, dict):
            return validate_company_data(value)
        if isinstance(value, str):
            if not value:
                return None
            try:
                parsed = json.loads(value)
            except (ValueError, TypeError) as exc:
                raise ValueError("Некорректные данные компании") from exc
            if not isinstance(parsed, dict):
                raise ValueError("Некорректные данные компании")  # noqa: TRY004 — Pydantic ловит только ValueError
            return validate_company_data(parsed)
        raise ValueError("Некорректные данные компании")


class ResponseCounters(BaseModel):
    "Счётчики откликов по вкладкам для бейджей в UI."
    all: int = 0
    review: int = 0
    in_progress: int = 0
    rejected: int = 0
    accepted: int = 0
    withdrawn_by_expert: int = 0


class ExpertResponseItem(BaseModel):
    "Карточка отклика эксперта в списке: данные отклика, заказа и исполнителя."
    id: int
    order_id: int
    expert_id: int = 0
    order_public_id: str = ""
    order_customer_id: int = 0
    status: ResponseStatus
    date: str
    comment: str
    proposed_sum: str
    proposed_start_date: str = ""
    proposed_deadline: str
    order_title: str
    order_sum: str
    order_start_date: str = ""
    order_date: str
    order_comment: str = ""
    order_responses_deadline: str | None = None
    order_created_at: str = ""
    customer_name: str
    customer_company: str
    customer_inn: str = ""
    order_documents: OrderDocuments = Field(default_factory=OrderDocuments)
    response_files: list[str] = []
    badges: list[BadgeResponse]
    created_at: datetime
    proposed_sum_amount_raw: int = 0
    proposed_start_date_raw: str = ""
    proposed_deadline_raw: str = ""
    previous_comment: str | None = None
    previous_proposed_sum: str | None = None
    previous_proposed_start_date: str | None = None
    previous_proposed_deadline: str | None = None
    previous_vat_kind: VatKind | None = None
    previous_response_files: list[str] | None = None
    order_previous_title: str | None = None
    order_previous_comment: str | None = None
    order_previous_sum: str | None = None
    order_previous_date: str | None = None
    order_previous_documents: OrderDocuments | None = None
    order_previous_badges: list[BadgeResponse] | None = None
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

    model_config = ConfigDict(from_attributes=True)


class ExpertResponseList(BaseModel):
    "Постраничный список откликов эксперта со счётчиками по вкладкам."
    items: list[ExpertResponseItem]
    has_more: bool
    counters: ResponseCounters
