import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from yookassa import Configuration

from models.payment import Payment, PaymentStatus
from models.pricing import SubscriptionStatus, UserSubscription

load_dotenv()

Configuration.account_id = os.getenv("YOOKASSA_SHOP_ID", "")
Configuration.secret_key = os.getenv("YOOKASSA_SECRET_KEY", "")


class PaymentWebhookService:
    "Приводит запись платежа в соответствие с событием YooKassa и активирует подписку."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def handle_webhook(self, event_type: str, yookassa_id: str) -> None:
        result = await self.db.execute(
            select(Payment).where(Payment.yookassa_id == yookassa_id)
        )
        payment = result.scalars().first()
        if payment is None:
            return

        if event_type == "payment.succeeded":
            await self.mark(payment, PaymentStatus.SUCCEEDED)
            await self.activate_subscription_for(payment)
        elif event_type == "payment.waiting_for_capture":
            await self.mark(payment, PaymentStatus.WAITING_FOR_CAPTURE)
        elif event_type == "payment.canceled":
            await self.mark(payment, PaymentStatus.CANCELED)
            await self.expire_pending_subscription_for(payment)

    async def mark(self, payment: Payment, new_status: PaymentStatus) -> None:
        if payment.status == new_status:
            return
        payment.status = new_status
        await self.db.flush()

    async def activate_subscription_for(self, payment: Payment) -> None:
        subscription = await self.find_subscription_for(payment)
        if subscription is None or subscription.status != SubscriptionStatus.PENDING:
            return
        subscription.status = SubscriptionStatus.ACTIVE
        await self.db.flush()

    async def expire_pending_subscription_for(self, payment: Payment) -> None:
        subscription = await self.find_subscription_for(payment)
        if subscription is None or subscription.status != SubscriptionStatus.PENDING:
            return
        subscription.status = SubscriptionStatus.EXPIRED
        await self.db.flush()

    async def find_subscription_for(self, payment: Payment) -> UserSubscription | None:
        result = await self.db.execute(
            select(UserSubscription).where(UserSubscription.payment_id == payment.id)
        )
        return result.scalars().first()
