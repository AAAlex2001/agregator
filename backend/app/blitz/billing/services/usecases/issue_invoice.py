"""Организация или ИП получает счёт на текущий этап."""

from app.blitz.billing.models import Invoice
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.billing.services.stages import amount_due, current_stage
from app.blitz.orders.models import BlitzOrder, CustomerType
from app.blitz.orders.services.exceptions import OrderStateError
from app.blitz.orders.services.rules import require_owner
from app.core.clock import now
from models.account import Account


class IssueInvoiceUseCase:
    """Счёт на сумму этапа с реквизитами из заявки.

    Пока счёт не оплачен, повторный запрос отдаёт тот же документ. Если цена изменилась,
    старый счёт аннулируется и выставляется новый.
    """

    def __init__(self, invoices: InvoiceRepository) -> None:
        self.invoices = invoices

    async def execute(self, customer: Account, order: BlitzOrder) -> Invoice:
        """Физлицу, без этапа к оплате или без реквизитов — OrderStateError."""

        require_owner(order, customer)

        if order.customer_type == CustomerType.INDIVIDUAL:
            raise OrderStateError("Физические лица оплачивают картой")

        stage = current_stage(order)
        if stage is None:
            raise OrderStateError("Сейчас платить нечего")

        company = order.company
        if company is None:
            raise OrderStateError("В заявке нет реквизитов организации")

        amount = amount_due(order, stage)

        for invoice in order.invoices:
            if invoice.is_open and invoice.stage == stage and invoice.amount == amount:
                return invoice

            if invoice.is_open:
                invoice.canceled_at = now()

        invoice = Invoice(
            stage=stage,
            amount=amount,
            payer_name=company.name,
            payer_inn=company.inn,
            payer_kpp=company.kpp,
            payer_address=company.address,
            created_at=now(),
        )
        order.invoices.append(invoice)
        await self.invoices.save()

        return invoice
