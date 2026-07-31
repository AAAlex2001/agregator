"Repository: доступ к БД для subscriptions."
from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.account import Account
from models.payment import Payment
from models.pricing import (
    PricingPlan,
    SubscriptionKind,
    SubscriptionStatus,
    UserSubscription,
)


class SubscriptionRepository:
    "SQL-операции, нужные для подписок и связанных платежей."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, entity: Payment | UserSubscription) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()

    async def find_user(self, user_id: int) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.id == user_id))
        ).scalars().first()

    async def find_plan(self, plan_id: int) -> PricingPlan | None:
        "Ищет сущность по заданным параметрам."
        query = select(PricingPlan).where(
            PricingPlan.id == plan_id,
            PricingPlan.is_active.is_(True),
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_latest_consumed_single(self, user_id: int) -> UserSubscription | None:
        "Самая свежая SINGLE-подписка пользователя, чей слот был использован."
        query = (
            select(UserSubscription)
            .where(
                UserSubscription.user_id == user_id,
                UserSubscription.kind == SubscriptionKind.SINGLE,
            )
            .options(selectinload(UserSubscription.payment))
            .order_by(UserSubscription.activated_at.desc())
        )
        rows = list((await self.db.execute(query)).scalars().all())
        for row in rows:
            if (row.responses_remaining or 0) == 0:
                return row
        return None

    async def find_active_for_user(self, user_id: int) -> UserSubscription | None:
        "Самая свежая ACTIVE-подписка пользователя."
        query = (
            select(UserSubscription)
            .where(
                UserSubscription.user_id == user_id,
                UserSubscription.status == SubscriptionStatus.ACTIVE,
            )
            .options(selectinload(UserSubscription.plan), selectinload(UserSubscription.payment))
            .order_by(UserSubscription.activated_at.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_by_payment_yookassa(self, yookassa_id: str) -> UserSubscription | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(UserSubscription)
            .join(Payment, Payment.id == UserSubscription.payment_id)
            .where(Payment.yookassa_id == yookassa_id)
            .options(selectinload(UserSubscription.payment))
        )
        return (await self.db.execute(query)).scalars().first()

    async def expire_stale(self, user_id: int, now: datetime) -> None:
        "Переводим истёкшие срочные подписки в EXPIRED."
        await self.db.execute(
            update(UserSubscription)
            .where(
                UserSubscription.user_id == user_id,
                UserSubscription.status == SubscriptionStatus.ACTIVE,
                UserSubscription.expires_at.isnot(None),
                UserSubscription.expires_at <= now,
            )
            .values(status=SubscriptionStatus.EXPIRED)
        )
