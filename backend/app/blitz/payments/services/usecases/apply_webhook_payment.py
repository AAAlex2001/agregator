"""Вебхук ЮKassa подтвердил оплату: если платёж за заявку Блиц-эксперта, зачесть его."""

from app.blitz.billing.models import PaymentStage
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.payments.services.repo import CardPaymentRepository
from app.blitz.payments.services.usecases.apply_card_payment import ApplyCardPaymentUseCase
from models.payment import Payment


class ApplyWebhookPaymentUseCase:
    """Находит заявку платежа, блокирует её и зачитывает оплату. Чужие платежи пропускает."""

    def __init__(
        self,
        payments: CardPaymentRepository,
        orders: OrderRepository,
        apply_payment: ApplyCardPaymentUseCase,
    ) -> None:
        self.payments = payments
        self.orders = orders
        self.apply_payment = apply_payment

    async def execute(self, payment: Payment) -> None:
        """Статус платежа уже проверен запросом к ЮKassa."""

        link = await self.payments.for_payment(payment.id)
        if link is None:
            return

        order = await self.orders.get_for_update(link.order_id)
        if order is None:
            return

        await self.apply_payment.execute(order, payment, PaymentStage(link.stage))
        await self.payments.save()
