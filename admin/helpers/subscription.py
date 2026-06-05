"Вычисления параметров подписки при ручной выдаче через админку (срок и остаток откликов)."

from datetime import datetime, timedelta

from models import PricingPlan, SubscriptionKind


def compute_subscription_expires_at(plan: PricingPlan, now: datetime) -> datetime | None:
    "Дата истечения подписки: None для разовой и для тарифов без срока, иначе now + duration_days."
    if plan.kind == SubscriptionKind.SINGLE:
        return None
    if plan.duration_days is None or plan.duration_days <= 0:
        return None
    return now + timedelta(days=plan.duration_days)


def compute_subscription_responses_remaining(kind: SubscriptionKind) -> int | None:
    "Стартовый остаток откликов: 1 для разовой подписки, None (безлимит) для прочих типов."
    if kind == SubscriptionKind.SINGLE:
        return 1
    return None
