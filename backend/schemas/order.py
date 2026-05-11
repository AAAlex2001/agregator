from datetime import date, datetime
from pathlib import Path
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from models.order import OrderStatus, BadgeVariant

ALLOWED_TECHNICAL_FILE_EXTENSIONS = {
    ".pdf",
    ".jpeg",
    ".jpg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
}


def _validate_technical_file_extensions(files: list[str]) -> list[str]:
    for file_name in files:
        extension = Path(file_name.split("?")[0]).suffix.lower()
        if extension not in ALLOWED_TECHNICAL_FILE_EXTENSIONS:
            raise ValueError(
                "Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX"
            )
    return files


class BadgeSchema(BaseModel):
    text: str = Field(..., max_length=50)
    variant: BadgeVariant


class BadgeResponse(BaseModel):
    text: str
    variant: str

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    title: str = Field(..., max_length=500)
    company: str = Field(default="", max_length=500)
    comment: str = Field(default="", max_length=5000)
    customer_id: int = Field(..., ge=1)
    sum_amount: int = Field(..., ge=0)
    deadline: date
    responses_deadline: datetime | None = None
    technical_files: list[str] = Field(default_factory=list)
    badges: list[BadgeSchema] = Field(default_factory=list)
    status: OrderStatus = OrderStatus.ACTIVE

    @field_validator("technical_files")
    @classmethod
    def validate_technical_files(cls, value: list[str]) -> list[str]:
        return _validate_technical_file_extensions(value)


class OrderUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    company: Optional[str] = Field(None, max_length=500)
    comment: Optional[str] = Field(None, max_length=5000)
    sum_amount: Optional[int] = Field(None, ge=0)
    deadline: Optional[date] = None
    responses_deadline: Optional[datetime] = None
    technical_files: Optional[list[str]] = None
    badges: Optional[list[BadgeSchema]] = None
    status: Optional[OrderStatus] = None

    @field_validator("technical_files")
    @classmethod
    def validate_technical_files(
        cls, value: Optional[list[str]]
    ) -> Optional[list[str]]:
        if value is None:
            return value
        return _validate_technical_file_extensions(value)


class OrderResponse(BaseModel):
    id: int
    public_id: str
    title: str
    company: str
    comment: str
    customer_id: int
    assigned_expert_id: int | None
    assigned_expert_name: str = ""
    customer_name: str
    sum: str
    sum_amount_raw: int
    date: str
    created_at_display: str = ""
    responses_deadline: str | None = None
    technical_files: list[str]
    badges: list[BadgeResponse]
    status: OrderStatus

    previous_title: str | None = None
    previous_comment: str | None = None
    previous_sum: str | None = None
    previous_date: str | None = None
    previous_technical_files: list[str] | None = None
    previous_badges: list[BadgeResponse] | None = None

    executor_name: str = ""
    executor_avatar_url: str | None = None
    executor_rating: float | None = None
    executor_review_count: int = 0
    executor_public_id: str = ""
    executor_proposed_sum: str = ""
    executor_proposed_deadline: str = ""
    executor_comment: str = ""
    executor_files: list[str] = []
    accepted_response_id: int | None = None
    customer_has_review: bool = False

    model_config = {"from_attributes": True}

    @staticmethod
    def _format_sum(amount_kopecks: int) -> str:
        roubles = amount_kopecks // 100
        formatted = f"{roubles:,}".replace(",", " ")
        if amount_kopecks % 100:
            kopecks = amount_kopecks % 100
            return f"{formatted},{kopecks:02d} \u20bd"
        return f"{formatted} \u20bd"

    @classmethod
    def from_archived_order(
        cls,
        order,
        accepted_response=None,
        has_review: bool = False,
    ) -> "OrderResponse":
        "Архивная карточка: данные заказа + исполнитель + его отклик + отметка об отзыве."
        base = cls.from_order(order)
        update: dict = {
            "previous_title": None,
            "previous_comment": None,
            "previous_sum": None,
            "previous_date": None,
            "previous_technical_files": None,
            "previous_badges": None,
        }

        expert = order.assigned_expert
        if expert is not None:
            full_name = " ".join(part for part in [expert.first_name or "", expert.last_name or ""] if part)
            update["assigned_expert_name"] = full_name
            update["executor_name"] = full_name
            update["executor_avatar_url"] = expert.avatar_url
            update["executor_rating"] = float(expert.rating) if expert.rating is not None else None
            update["executor_review_count"] = expert.review_count or 0
            update["executor_public_id"] = expert.public_id or ""

        if accepted_response is not None:
            update["accepted_response_id"] = accepted_response.id
            update["executor_proposed_sum"] = cls._format_sum(accepted_response.proposed_sum_amount)
            update["executor_proposed_deadline"] = accepted_response.proposed_deadline.strftime("%d.%m.%Y")
            update["executor_comment"] = accepted_response.comment or ""
            update["executor_files"] = list(accepted_response.technical_files or [])

        update["customer_has_review"] = has_review
        return base.model_copy(update=update)

    @classmethod
    def from_order(cls, order) -> "OrderResponse":
        amount = order.sum_amount
        sum_display = "Не определено" if amount == 0 else cls._format_sum(amount)

        customer_name = order.company or ""

        date_display = order.deadline.strftime("%d.%m.%Y")
        created_at_display = order.created_at.strftime("%d.%m.%Y") if order.created_at else ""

        responses_deadline_display = None
        if order.responses_deadline:
            responses_deadline_display = order.responses_deadline.isoformat()

        badges = [
            BadgeResponse(text=b.text, variant=b.variant.value)
            for b in order.badges
        ]

        previous_sum = (
            cls._format_sum(order.previous_sum_amount)
            if getattr(order, "previous_sum_amount", None) is not None
            else None
        )
        previous_date = (
            order.previous_deadline.strftime("%d.%m.%Y")
            if getattr(order, "previous_deadline", None) is not None
            else None
        )
        previous_files_raw = getattr(order, "previous_technical_files", None)
        previous_files = list(previous_files_raw) if isinstance(previous_files_raw, list) else None

        previous_badges_raw = getattr(order, "previous_badges", None)
        previous_badges = (
            [BadgeResponse(text=b.get("text", ""), variant=b.get("variant", ""))
             for b in previous_badges_raw]
            if isinstance(previous_badges_raw, list)
            else None
        )

        return cls(
            id=order.id,
            public_id=order.public_id,
            title=order.title,
            company=order.company or "",
            comment=order.comment or "",
            customer_id=order.customer_id,
            assigned_expert_id=order.assigned_expert_id,
            customer_name=customer_name,
            sum=sum_display,
            sum_amount_raw=amount,
            date=date_display,
            created_at_display=created_at_display,
            responses_deadline=responses_deadline_display,
            technical_files=order.technical_files or [],
            badges=badges,
            status=order.status,
            previous_title=getattr(order, "previous_title", None),
            previous_comment=getattr(order, "previous_comment", None),
            previous_sum=previous_sum,
            previous_date=previous_date,
            previous_technical_files=previous_files,
            previous_badges=previous_badges,
        )


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    has_more: bool
