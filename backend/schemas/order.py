from datetime import date, datetime
from pathlib import Path
from typing import Optional

from pydantic import BaseModel, Field, model_validator

from models.order import OrderStatus, BadgeVariant

ALLOWED_DOCUMENT_EXTENSIONS = {
    ".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx",
}


MAX_ORDER_DOCUMENTS = 6


class OrderDocuments(BaseModel):
    "Документы заказа по 4 категориям. ТЗ/договор/карточка компании — по одному файлу, иное — до общего лимита."

    technical: list[str] = Field(default_factory=list, max_length=1)
    contract: list[str] = Field(default_factory=list, max_length=1)
    company: list[str] = Field(default_factory=list, max_length=1)
    other: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def check_limits_and_extensions(self) -> "OrderDocuments":
        total = len(self.technical) + len(self.contract) + len(self.company) + len(self.other)
        if total > MAX_ORDER_DOCUMENTS:
            raise ValueError(f"Не более {MAX_ORDER_DOCUMENTS} файлов на заказ")
        for path in (*self.technical, *self.contract, *self.company, *self.other):
            extension = Path(path.split("?")[0]).suffix.lower()
            if extension not in ALLOWED_DOCUMENT_EXTENSIONS:
                raise ValueError(
                    "Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX"
                )
        return self


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
    start_date: date | None = None
    deadline: date
    responses_deadline: datetime | None = None
    requires_expert: bool = True
    requires_license: bool = True
    documents: OrderDocuments = Field(default_factory=OrderDocuments)
    badges: list[BadgeSchema] = Field(default_factory=list)
    status: OrderStatus = OrderStatus.ACTIVE


class OrderUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    company: Optional[str] = Field(None, max_length=500)
    comment: Optional[str] = Field(None, max_length=5000)
    sum_amount: Optional[int] = Field(None, ge=0)
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    responses_deadline: Optional[datetime] = None
    requires_expert: Optional[bool] = None
    requires_license: Optional[bool] = None
    documents: Optional[OrderDocuments] = None
    badges: Optional[list[BadgeSchema]] = None
    status: Optional[OrderStatus] = None


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
    customer_inn: str = ""
    sum: str
    sum_amount_raw: int
    start_date: str = ""
    date: str
    created_at_display: str = ""
    responses_deadline: str | None = None
    requires_expert: bool
    requires_license: bool
    documents: OrderDocuments
    badges: list[BadgeResponse]
    status: OrderStatus

    previous_title: str | None = None
    previous_comment: str | None = None
    previous_sum: str | None = None
    previous_date: str | None = None
    previous_documents: OrderDocuments | None = None
    previous_badges: list[BadgeResponse] | None = None

    executor_name: str = ""
    executor_avatar_url: str | None = None
    executor_rating: float | None = None
    executor_review_count: int = 0
    executor_public_id: str = ""
    executor_proposed_sum: str = ""
    executor_proposed_start_date: str = ""
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
            return f"{formatted},{kopecks:02d} ₽"
        return f"{formatted} ₽"

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
            "previous_documents": None,
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
            update["executor_proposed_start_date"] = (
                accepted_response.proposed_start_date.strftime("%d.%m.%Y")
                if accepted_response.proposed_start_date
                else ""
            )
            update["executor_proposed_deadline"] = accepted_response.proposed_deadline.strftime("%d.%m.%Y")
            update["executor_comment"] = accepted_response.comment or ""
            update["executor_files"] = list(accepted_response.technical_files or [])

        update["customer_has_review"] = has_review
        return base.model_copy(update=update)

    @classmethod
    def from_order(cls, order) -> "OrderResponse":
        from services.orders.documents import OrderDocumentsService

        amount = order.sum_amount
        sum_display = "Не определено" if amount == 0 else cls._format_sum(amount)

        customer_name = order.company or ""
        customer_inn = (order.customer.inn or "") if order.customer is not None else ""
        start_date_display = order.start_date.strftime("%d.%m.%Y") if order.start_date else ""
        date_display = order.deadline.strftime("%d.%m.%Y")
        created_at_display = order.created_at.strftime("%d.%m.%Y") if order.created_at else ""

        responses_deadline_display = (
            order.responses_deadline.isoformat() if order.responses_deadline else None
        )

        badges = [
            BadgeResponse(text=b.text, variant=b.variant.value)
            for b in order.badges
        ]

        previous_sum = (
            cls._format_sum(order.previous_sum_amount)
            if order.previous_sum_amount is not None
            else None
        )
        previous_date = (
            order.previous_deadline.strftime("%d.%m.%Y")
            if order.previous_deadline is not None
            else None
        )

        previous_badges_raw = order.previous_badges
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
            customer_inn=customer_inn,
            sum=sum_display,
            sum_amount_raw=amount,
            start_date=start_date_display,
            date=date_display,
            created_at_display=created_at_display,
            responses_deadline=responses_deadline_display,
            requires_expert=order.requires_expert,
            requires_license=order.requires_license,
            documents=OrderDocumentsService.from_order(order),
            badges=badges,
            status=order.status,
            previous_title=order.previous_title,
            previous_comment=order.previous_comment,
            previous_sum=previous_sum,
            previous_date=previous_date,
            previous_documents=OrderDocumentsService.from_order_previous(order),
            previous_badges=previous_badges,
        )


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    has_more: bool
