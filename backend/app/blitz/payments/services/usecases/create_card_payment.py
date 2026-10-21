"""Физлицо платит за этап картой через ЮKassa."""

from app.blitz.billing.services.stages import STAGE_TITLES, amount_due, current_stage
from app.blitz.notifications import order_path
from app.blitz.orders.models import BlitzOrder, CustomerType
from app.blitz.orders.services.exceptions import OrderStateError
from app.blitz.orders.services.rules import require_owner
from app.blitz.payments.models import CardPayment
from app.blitz.payments.services.amounts import to_kopecks
from app.blitz.payments.services.repo import CardPaymentRepository
from app.core.config import get_settings
from app.core.yookassa import YooKassaClient
from models.account import Account
from models.payment import Payment, PaymentStatus, PaymentType


class CreateCardPaymentUseCase:
    """Ссылка на оплату этапа. Неоплаченный платёж на ту же сумму переиспользуется."""

    def __init__(self, payments: CardPaymentRepository, gateway: YooKassaClient) -> None:
        self.payments = payments
        self.gateway = gateway

    async def execute(self, customer: Account, order: BlitzOrder) -> str:
        """Организации, без этапа к оплате или без почты для чека — OrderStateError."""

        require_owner(order, customer)

        if order.customer_type != CustomerType.INDIVIDUAL:
            raise OrderStateError("Организации оплачивают по счёту")

        stage = current_stage(order)
        if stage is None:
            raise OrderStateError("Сейчас платить нечего")

        if not customer.email:
            raise OrderStateError("Укажите почту в профиле: на неё придёт чек")

        amount = amount_due(order, stage)
        url = await self.pending_url(order.id, stage, to_kopecks(amount))
        if url is not None:
            return url

        description = f"Блиц-эксперт, заявка №{order.id}: {STAGE_TITLES[stage].lower()}"
        payment = Payment(
            user_id=customer.id,
            amount=to_kopecks(amount),
            payment_type=PaymentType.DEPOSIT,
            status=PaymentStatus.PENDING,
            description=description,
        )
        await self.payments.add(payment, CardPayment(order_id=order.id, stage=stage))

        created = await self.gateway.create_payment(
            amount=amount,
            description=description,
            email=customer.email,
            return_url=f"{get_settings().public_base_url}{order_path(order)}?payment=return",
            idempotence_key=f"blitz-payment-{payment.id}",
        )
        payment.yookassa_id = created.id
        await self.payments.save()

        if created.confirmation_url is None:
            raise OrderStateError("Платёжный сервис не выдал ссылку на оплату, попробуйте ещё раз")

        return created.confirmation_url

    async def pending_url(self, order_id: int, stage: str, kopecks: int) -> str | None:
        """Ссылка неоплаченного платежа на ту же сумму или None."""

        for link in await self.payments.list_for_order(order_id):
            payment = link.payment

            if link.stage != stage or payment.status != PaymentStatus.PENDING or payment.amount != kopecks:
                continue

            if payment.yookassa_id is None:
                continue

            remote = await self.gateway.get_payment(payment.yookassa_id)
            if remote.status == "pending" and remote.confirmation_url:
                return remote.confirmation_url

        return None
