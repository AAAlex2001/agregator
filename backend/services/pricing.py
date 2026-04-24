from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.pricing import PricingPlan
from schemas.pricing import PricingPlanResponse


def format_price_display(price_kopecks: int) -> str:
    rubles = price_kopecks // 100
    formatted = f"{rubles:,}".replace(",", " ")
    if price_kopecks % 100 == 0:
        return f"{formatted} ₽"
    kopecks = price_kopecks % 100
    return f"{formatted},{kopecks:02d} ₽"


class PricingService:
    "Чтение витрины тарифов. Показываем только is_active=true, сортируем по sort_order."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_active(self) -> list[PricingPlanResponse]:
        query = (
            select(PricingPlan)
            .where(PricingPlan.is_active.is_(True))
            .order_by(PricingPlan.sort_order.asc(), PricingPlan.id.asc())
        )
        plans = list((await self.db.execute(query)).scalars().all())
        return [self.to_response(plan) for plan in plans]

    @staticmethod
    def to_response(plan: PricingPlan) -> PricingPlanResponse:
        return PricingPlanResponse(
            id=plan.id,
            kind=plan.kind,
            name=plan.name,
            badge=plan.badge,
            price_kopecks=plan.price_kopecks,
            price_display=format_price_display(plan.price_kopecks),
            period_label=plan.period_label,
            duration_days=plan.duration_days,
            description=plan.description,
            cta_label=plan.cta_label,
            features=list(plan.features or []),
            highlighted=plan.highlighted,
            sort_order=plan.sort_order,
        )
