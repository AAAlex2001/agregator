"""Кнопка «Проверить оплату»: спросить ЮKassa о неоплаченных платежах заявки."""

from app.blitz.billing.models import PaymentStage
from app.blitz.orders.models import BlitzOrder
from app.blitz.payments.services.repo import CardPaymentRepository
from app.blitz.payments.services.usecases.apply_card_payment import ApplyCardPaymentUseCase
from app.core.yookassa import YooKassaClient
from models.payment import PaymentStatus

SUCCEEDED = "succeeded"
CANCELED = "canceled"


class SyncCardPaymentsUseCase:
    """Статусу на нашей стороне не верим: каждый ожидающий платёж перепроверяется в ЮKassa."""

    def __init__(
        self,
        payments: CardPaymentRepository,
        gateway: YooKassaClient,
        apply_payment: ApplyCardPaymentUseCase,
    ) -> None:
        self.payments = payments
        self.gateway = gateway
        self.apply_payment = apply_payment

    async def execute(self, order: BlitzOrder) -> BlitzOrder:
        """Оплаченные засчитываются, отменённые помечаются."""

        for link in await self.payments.list_for_order(order.id):
            payment = link.payment

            if payment.status != PaymentStatus.PENDING or payment.yookassa_id is None:
                continue

            remote = await self.gateway.get_payment(payment.yookassa_id)

            if remote.status == SUCCEEDED:
                await self.apply_payment.execute(order, payment, PaymentStage(link.stage))
            elif remote.status == CANCELED:
                payment.status = PaymentStatus.CANCELED

        await self.payments.save()

        return order
