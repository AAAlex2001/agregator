from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, computed_field

from models.order import OrderStatus, BadgeVariant


class BadgeSchema(BaseModel):
    text: str = Field(..., max_length=50)
    variant: BadgeVariant


class BadgeResponse(BaseModel):
    text: str
    variant: str

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    title: str = Field(..., max_length=500)
    customer_id: int = Field(..., ge=1)
    sum_amount: int = Field(..., gt=0)
    deadline: date
    badges: list[BadgeSchema] = Field(default_factory=list)
    status: OrderStatus = OrderStatus.ACTIVE


class OrderUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    sum_amount: Optional[int] = Field(None, gt=0)
    deadline: Optional[date] = None
    badges: Optional[list[BadgeSchema]] = None
    status: Optional[OrderStatus] = None


class OrderResponse(BaseModel):
    id: int
    title: str
    customer_id: int
    customer_name: str
    sum: str
    date: str
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
            customer_id=order.customer_id,
            customer_name=customer_name,
            sum=sum_display,
            date=date_display,
            badges=badges,
            status=order.status,
        )


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    total: int
