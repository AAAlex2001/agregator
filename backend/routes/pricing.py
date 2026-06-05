from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.payment import PaymentStatus
from models.pricing import SubscriptionKind, UserSubscription
from schemas.pricing import (
    PricingPlansResponse,
    SubscribeRequest,
    SubscribeResponse,
    UserSubscriptionResponse,
)
from services.pricing import PricingService
from services.subscriptions import PurchaseSubscriptionUseCase, SubscriptionRepository

router = APIRouter(prefix="/pricing", tags=["pricing"])


def build_active_label(subscription: UserSubscription, payment_pending: bool) -> str:
    if payment_pending:
        return "Платёж в обработке"
    if subscription.kind == SubscriptionKind.SINGLE:
        remaining = subscription.responses_remaining or 0
        return f"Активен — осталось откликов: {remaining}" if remaining > 0 else "Использован"
    if subscription.expires_at is not None:
        return f"Активен до {subscription.expires_at.strftime('%d.%m.%Y')}"
    return "Активен"


def serialize_subscription(subscription: UserSubscription) -> UserSubscriptionResponse:
    payment_pending = bool(
        subscription.payment is not None
        and subscription.payment.status != PaymentStatus.SUCCEEDED
    )
    return UserSubscriptionResponse(
        id=subscription.id,
        plan_id=subscription.plan_id,
        plan_name=subscription.plan.name if subscription.plan else "",
        kind=subscription.kind,
        status=subscription.status,
        activated_at=subscription.activated_at,
        expires_at=subscription.expires_at,
        responses_remaining=subscription.responses_remaining,
        payment_pending=payment_pending,
        active_label=build_active_label(subscription, payment_pending),
    )


@router.get("/", response_model=PricingPlansResponse)
async def list_pricing_plans(db: AsyncSession = Depends(get_db)):
    service = PricingService(db)
    plans = await service.list_active()
    return PricingPlansResponse(plans=plans)


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(
    data: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = PurchaseSubscriptionUseCase(SubscriptionRepository(db))
    result = await use_case.execute(
        user_id=user_id, plan_id=data.plan_id, return_url=data.return_url
    )
    return SubscribeResponse(
        subscription_id=result.subscription.id,
        confirmation_url=result.confirmation_url,
    )


@router.get("/my-subscription", response_model=UserSubscriptionResponse | None)
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = SubscriptionRepository(db)
    subscription = await repo.find_active_for_user(user_id)
    if subscription is None:
        return None
    return serialize_subscription(subscription)
