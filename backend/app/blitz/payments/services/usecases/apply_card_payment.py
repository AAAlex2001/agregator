"""Оплата картой прошла: зачесть её в заявку и сообщить сторонам.

Вызывается из вебхука ЮKassa и из кнопки «Проверить оплату». Платёж засчитывается один раз:
дальше его статус уже SUCCEEDED.
"""

from app.blitz.billing.models import PaymentStage
from app.blitz.billing.services.stages import accept_payment
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder
from app.blitz.payments.services.amounts import to_rubles
from app.core.money import format_rub
from models.payment import Payment, PaymentStatus


class ApplyCardPaymentUseCase:
    """Помечает платёж оплаченным, зачитывает сумму и двигает заявку."""

    def __init__(self, notifier: BlitzNotifier) -> None:
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, payment: Payment, stage: PaymentStage) -> None:
        """Повторный вызов с уже зачтённым платежом ничего не меняет."""

        if payment.status == PaymentStatus.SUCCEEDED:
            return

        payment.status = PaymentStatus.SUCCEEDED
        amount = to_rubles(payment.amount)
        expert_message = accept_payment(order, stage, amount)

        await self.notifier.notify(order.customer, order, f"Оплата {format_rub(amount)} картой получена")

        if expert_message is not None:
            await self.notifier.notify(order.expert, order, expert_message)
