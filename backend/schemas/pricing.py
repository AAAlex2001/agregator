from datetime import datetime

from pydantic import BaseModel, Field

from models.pricing import SubscriptionKind, SubscriptionStatus


class PricingPlanResponse(BaseModel):
    "Публичное представление тарифа для витрины."
    id: int
    kind: SubscriptionKind
    name: str
    badge: str | None = None
    price_kopecks: int
    price_display: str
    period_label: str
    duration_days: int | None = None
    description: str
    cta_label: str
    features: list[str] = Field(default_factory=list)
    highlighted: bool
    sort_order: int

    model_config = {"from_attributes": True}


class PricingPlansResponse(BaseModel):
    plans: list[PricingPlanResponse]


class UserSubscriptionResponse(BaseModel):
    id: int
    plan_id: int
    plan_name: str
    kind: SubscriptionKind
    status: SubscriptionStatus
    activated_at: datetime
    expires_at: datetime | None = None
    responses_remaining: int | None = None
    payment_pending: bool = False
    active_label: str


class SubscribeRequest(BaseModel):
    plan_id: int = Field(..., ge=1)
    return_url: str = Field(..., min_length=1)


class SubscribeResponse(BaseModel):
    subscription_id: int
    confirmation_url: str
