"Сервисный модуль: payment."
import logging
import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from yookassa import Configuration
from yookassa import Payment as YooPayment

from models.payment import Payment, PaymentStatus
from models.pricing import SubscriptionStatus, UserSubscription

load_dotenv()

Configuration.account_id = os.getenv("YOOKASSA_SHOP_ID", "")
Configuration.secret_key = os.getenv("YOOKASSA_SECRET_KEY", "")

logger = logging.getLogger(__name__)


YOOKASSA_TO_PAYMENT_STATUS = {
    "succeeded": PaymentStatus.SUCCEEDED,
    "waiting_for_capture": PaymentStatus.WAITING_FOR_CAPTURE,
    "canceled": PaymentStatus.CANCELED,
}

TERMINAL_PAYMENT_STATUSES = {PaymentStatus.SUCCEEDED, PaymentStatus.CANCELED}


class PaymentWebhookService:
    "Приводит запись платежа в соответствие с событием YooKassa и активирует подписку."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def handle_webhook(self, yookassa_id: str) -> None:
        "Публичный метод сервисного слоя."
        result = await self.db.execute(
            select(Payment).where(Payment.yookassa_id == yookassa_id)
        )
        payment = result.scalars().first()
        if payment is not None and payment.status in TERMINAL_PAYMENT_STATUSES:
            return

        try:
            verified_status = self.verify_with_yookassa(yookassa_id)
        except Exception:
            logger.exception(
                "Failed to verify YooKassa payment %s; letting YooKassa retry",
                yookassa_id,
            )
            return
        if verified_status is None:
            return

        if payment is None:
            return

        if verified_status == PaymentStatus.SUCCEEDED:
            await self.mark(payment, PaymentStatus.SUCCEEDED)
            await self.activate_subscription_for(payment)
        elif verified_status == PaymentStatus.WAITING_FOR_CAPTURE:
            await self.mark(payment, PaymentStatus.WAITING_FOR_CAPTURE)
        elif verified_status == PaymentStatus.CANCELED:
            await self.mark(payment, PaymentStatus.CANCELED)
            await self.expire_pending_subscription_for(payment)

    @staticmethod
    def verify_with_yookassa(yookassa_id: str) -> PaymentStatus | None:
        "Подтягивает статус платежа из YooKassa API. Возвращает None, если не нашли."
        remote = YooPayment.find_one(yookassa_id)
        return YOOKASSA_TO_PAYMENT_STATUS.get(remote.status)

    async def mark(self, payment: Payment, new_status: PaymentStatus) -> None:
        "Публичный метод сервисного слоя."
        if payment.status == new_status:
            return
        payment.status = new_status
        await self.db.flush()

    async def activate_subscription_for(self, payment: Payment) -> None:
        "Публичный метод сервисного слоя."
        subscription = await self.find_subscription_for(payment)
        if subscription is None or subscription.status != SubscriptionStatus.PENDING:
            return
        subscription.status = SubscriptionStatus.ACTIVE
        await self.db.flush()

    async def expire_pending_subscription_for(self, payment: Payment) -> None:
        "Публичный метод сервисного слоя."
        subscription = await self.find_subscription_for(payment)
        if subscription is None or subscription.status != SubscriptionStatus.PENDING:
            return
        subscription.status = SubscriptionStatus.EXPIRED
        await self.db.flush()

    async def find_subscription_for(self, payment: Payment) -> UserSubscription | None:
        "Ищет сущность по заданным параметрам."
        result = await self.db.execute(
            select(UserSubscription).where(UserSubscription.payment_id == payment.id)
        )
        return result.scalars().first()
