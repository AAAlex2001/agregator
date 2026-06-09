"Use case: purchase subscription."
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any, TypedDict

from fastapi import HTTPException, status
from yookassa import Payment as YooPayment

from models.payment import Payment, PaymentStatus, PaymentType
from models.pricing import (
    PricingPlan,
    SubscriptionKind,
    SubscriptionStatus,
    UserSubscription,
)
from models.user import User
from services.subscriptions.constants import (
    KOPECKS_PER_RUBLE,
    SINGLE_RESPONSES,
    YOOKASSA_CONFIRMATION_REDIRECT,
    YOOKASSA_CURRENCY,
)
from services.subscriptions.receipts import build_receipt
from services.subscriptions.repository import SubscriptionRepository


class YooAmount(TypedDict):
    "Сумма платежа в формате YooKassa."
    value: str
    currency: str


class YooConfirmation(TypedDict):
    "Параметры подтверждения платежа YooKassa."
    type: str
    return_url: str


class YooMetadata(TypedDict):
    "Метаданные платежа: связи с внутренними сущностями."
    payment_id: int
    user_id: int
    subscription_id: int
    plan_id: int


class YooPayload(TypedDict):
    "Полезная нагрузка для YooPayment.create."
    amount: YooAmount
    confirmation: YooConfirmation
    capture: bool
    description: str
    receipt: dict[str, Any]
    metadata: YooMetadata


@dataclass(frozen=True)
class PurchaseResult:
    "DTO с данными для передачи между слоями."
    subscription: UserSubscription
    confirmation_url: str


class PurchaseSubscriptionUseCase:
    "Создаёт платёж YooKassa + pending-запись подписки. Активирует подписку на вебхуке SUCCEEDED."

    def __init__(self, repo: SubscriptionRepository) -> None:
        self.repo = repo

    async def execute(self, user_id: int, plan_id: int, return_url: str) -> PurchaseResult:
        "Запускает основной сценарий use case."
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

        user = await self.repo.find_user(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        payment = self.build_payment(user, plan)
        await self.repo.add(payment)
        await self.repo.flush()

        subscription = self.build_subscription(user, plan, payment)
        await self.repo.add(subscription)
        await self.repo.flush()

        yoo_payment = YooPayment.create(
            self.build_yoo_payload(user, plan, payment, subscription, return_url),
            str(uuid.uuid4()),
        )
        payment.yookassa_id = yoo_payment.id
        await self.repo.flush()

        return PurchaseResult(
            subscription=subscription,
            confirmation_url=yoo_payment.confirmation.confirmation_url,
        )

    @staticmethod
    def build_payment(user: User, plan: PricingPlan) -> Payment:
        "Строит объект из входных данных."
        return Payment(
            user_id=user.id,
            amount=plan.price_kopecks,
            payment_type=PaymentType.DEPOSIT,
            status=PaymentStatus.PENDING,
            description=f"{plan.name} — {plan.price_kopecks / KOPECKS_PER_RUBLE:.0f} ₽",
        )

    @classmethod
    def build_subscription(
        cls, user: User, plan: PricingPlan, payment: Payment
    ) -> UserSubscription:
        "Строит объект из входных данных."
        now = datetime.now(UTC)
        return UserSubscription(
            user_id=user.id,
            plan_id=plan.id,
            kind=plan.kind,
            status=SubscriptionStatus.PENDING,
            activated_at=now,
            expires_at=cls.compute_expires_at(plan, now),
            responses_remaining=cls.compute_responses_remaining(plan.kind),
            payment_id=payment.id,
        )

    @staticmethod
    def build_yoo_payload(
        user: User,
        plan: PricingPlan,
        payment: Payment,
        subscription: UserSubscription,
        return_url: str,
    ) -> YooPayload:
        "Строит объект из входных данных."
        return YooPayload(
            amount=YooAmount(
                value=f"{plan.price_kopecks / KOPECKS_PER_RUBLE:.2f}",
                currency=YOOKASSA_CURRENCY,
            ),
            confirmation=YooConfirmation(
                type=YOOKASSA_CONFIRMATION_REDIRECT, return_url=return_url
            ),
            capture=True,
            description=payment.description,
            receipt=build_receipt(user, plan),
            metadata=YooMetadata(
                payment_id=payment.id,
                user_id=user.id,
                subscription_id=subscription.id,
                plan_id=plan.id,
            ),
        )

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
        "Публичный метод сервисного слоя."
        if kind == SubscriptionKind.SINGLE:
            return SINGLE_RESPONSES
        return None
