import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from yookassa import Payment as YooPayment

from models.payment import Payment, PaymentStatus, PaymentType
from models.pricing import (
    PricingPlan,
    SubscriptionKind,
    SubscriptionStatus,
    UserSubscription,
)
from models.user import User


SINGLE_RESPONSES = 1


@dataclass(frozen=True)
class PurchaseResult:
    subscription: UserSubscription
    confirmation_url: str


class SubscriptionRepository:
    "SQL-операции, нужные для подписок."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_plan(self, plan_id: int) -> PricingPlan | None:
        query = select(PricingPlan).where(
            PricingPlan.id == plan_id,
            PricingPlan.is_active.is_(True),
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_active_for_user(self, user_id: int) -> UserSubscription | None:
        "Самая свежая ACTIVE-подписка пользователя с подтверждённым платежом."
        query = (
            select(UserSubscription)
            .where(
                UserSubscription.user_id == user_id,
                UserSubscription.status == SubscriptionStatus.ACTIVE,
            )
            .options(selectinload(UserSubscription.plan), selectinload(UserSubscription.payment))
            .order_by(UserSubscription.activated_at.desc())
        )
        rows = list((await self.db.execute(query)).scalars().all())
        for row in rows:
            if row.payment is None or row.payment.status == PaymentStatus.SUCCEEDED:
                return row
        return None

    async def find_by_payment_yookassa(self, yookassa_id: str) -> UserSubscription | None:
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


class SubscriptionPurchaseService:
    "Создаёт платёж YooKassa + pending-запись подписки. Активирует подписку на вебхуке SUCCEEDED."

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SubscriptionRepository(db)

    async def purchase(self, user_id: int, plan_id: int, return_url: str) -> PurchaseResult:
        return_url = (return_url or "").strip()
        if not return_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не задан URL возврата после оплаты",
            )

        plan = await self.repo.find_plan(plan_id)
        if plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Тариф не найден",
            )

        user = (await self.db.execute(select(User).where(User.id == user_id))).scalars().first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        payment = Payment(
            user_id=user.id,
            amount=plan.price_kopecks,
            payment_type=PaymentType.DEPOSIT,
            status=PaymentStatus.PENDING,
            description=f"{plan.name} — {plan.price_kopecks / 100:.0f} ₽",
        )
        self.db.add(payment)
        await self.db.flush()

        now = datetime.now(timezone.utc)
        subscription = UserSubscription(
            user_id=user.id,
            plan_id=plan.id,
            kind=plan.kind,
            status=SubscriptionStatus.ACTIVE,
            activated_at=now,
            expires_at=self.compute_expires_at(plan, now),
            responses_remaining=self.compute_responses_remaining(plan.kind),
            payment_id=payment.id,
        )
        self.db.add(subscription)
        await self.db.flush()

        idempotence_key = str(uuid.uuid4())
        yoo_payment = YooPayment.create(
            {
                "amount": {"value": f"{plan.price_kopecks / 100:.2f}", "currency": "RUB"},
                "confirmation": {"type": "redirect", "return_url": return_url},
                "capture": True,
                "description": payment.description,
                "metadata": {
                    "payment_id": payment.id,
                    "user_id": user.id,
                    "subscription_id": subscription.id,
                    "plan_id": plan.id,
                },
            },
            idempotence_key,
        )

        payment.yookassa_id = yoo_payment.id
        await self.db.flush()

        return PurchaseResult(subscription=subscription, confirmation_url=yoo_payment.confirmation.confirmation_url)

    @staticmethod
    def compute_expires_at(plan: PricingPlan, now: datetime) -> datetime | None:
        "Срок действия — из админки (plan.duration_days). Для SINGLE остаётся NULL."
        if plan.kind == SubscriptionKind.SINGLE:
            return None
        if plan.duration_days is None or plan.duration_days <= 0:
            return None
        return now + timedelta(days=plan.duration_days)

    @staticmethod
    def compute_responses_remaining(kind: SubscriptionKind) -> int | None:
        if kind == SubscriptionKind.SINGLE:
            return SINGLE_RESPONSES
        return None


class SubscriptionAccess:
    "Gate-проверка: может ли эксперт создать отклик. Если да — списывает SINGLE-слот."

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SubscriptionRepository(db)

    async def require_for_response(self, user_id: int) -> UserSubscription:
        now = datetime.now(timezone.utc)
        await self.repo.expire_stale(user_id, now)
        await self.db.flush()

        subscription = await self.repo.find_active_for_user(user_id)
        if subscription is None:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Нет активной подписки. Выберите тариф, чтобы откликаться на заказы.",
            )
        if subscription.kind == SubscriptionKind.SINGLE and (subscription.responses_remaining or 0) <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Разовый отклик уже использован. Оформите тариф, чтобы откликаться дальше.",
            )
        if subscription.expires_at is not None and subscription.expires_at <= now:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Срок подписки истёк. Продлите доступ.",
            )
        return subscription

    async def consume_for_response(self, subscription: UserSubscription) -> None:
        if subscription.kind != SubscriptionKind.SINGLE:
            return
        remaining = (subscription.responses_remaining or 0) - 1
        subscription.responses_remaining = max(0, remaining)
        if remaining <= 0:
            subscription.status = SubscriptionStatus.USED
        await self.db.flush()
