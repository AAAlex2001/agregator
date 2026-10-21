"""Администратор видит деньги на расчётном счёте и подтверждает оплату счёта."""

from app.blitz.billing.models import Invoice, PaymentStage
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.billing.services.stages import accept_payment
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.exceptions import OrderStateError
from app.core.clock import now
from app.core.money import format_rub


class ConfirmInvoiceUseCase:
    """Зачитывает оплату и сдвигает заявку, если этап оплачен целиком."""

    def __init__(self, invoices: InvoiceRepository, notifier: BlitzNotifier) -> None:
        self.invoices = invoices
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, invoice: Invoice) -> Invoice:
        """Оплаченный или аннулированный счёт — OrderStateError."""

        if not invoice.is_open:
            raise OrderStateError("Счёт уже оплачен или аннулирован")

        invoice.paid_at = now()
        expert_message = accept_payment(order, PaymentStage(invoice.stage), invoice.amount)
        await self.invoices.save()

        await self.notifier.notify(
            order.customer,
            order,
            f"Оплата по счёту № {invoice.number} на {format_rub(invoice.amount)} получена",
        )

        if expert_message is not None:
            await self.notifier.notify(order.expert, order, expert_message)

        return invoice
