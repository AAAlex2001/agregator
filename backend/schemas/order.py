from datetime import date
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
    typical_names: str = Field(default="", max_length=1000)
    comment: str = Field(default="", max_length=5000)
    customer_id: int = Field(..., ge=1)
    sum_amount: int = Field(..., gt=0)
    deadline: date
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
    typical_names: Optional[str] = Field(None, max_length=1000)
    comment: Optional[str] = Field(None, max_length=5000)
    sum_amount: Optional[int] = Field(None, gt=0)
    deadline: Optional[date] = None
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
    title: str
    company: str
    typical_names: str
    comment: str
    customer_id: int
    assigned_expert_id: int | None
    customer_name: str
    sum: str
    date: str
    technical_files: list[str]
    badges: list[BadgeResponse]
    status: OrderStatus

    model_config = {"from_attributes": True}

    @classmethod
    def from_order(cls, order) -> "OrderResponse":
        amount = order.sum_amount
        roubles = amount // 100
        formatted = f"{roubles:,}".replace(",", " ")
        if amount % 100:
            kopecks = amount % 100
            sum_display = f"{formatted},{kopecks:02d} \u20bd"
        else:
            sum_display = f"{formatted} \u20bd"

        customer_name = ""
        if order.customer:
            customer_name = order.customer.email or order.customer.phone or ""

        date_display = order.deadline.strftime("%d.%m.%Y")

        badges = [
            BadgeResponse(text=b.text, variant=b.variant.value)
            for b in order.badges
        ]

        return cls(
            id=order.id,
            title=order.title,
            company=order.company or "",
            typical_names=order.typical_names or "",
            comment=order.comment or "",
            customer_id=order.customer_id,
            assigned_expert_id=order.assigned_expert_id,
            customer_name=customer_name,
            sum=sum_display,
            date=date_display,
            technical_files=order.technical_files or [],
            badges=badges,
            status=order.status,
        )


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    total: int
