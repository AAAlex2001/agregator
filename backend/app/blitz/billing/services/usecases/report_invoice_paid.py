"""Заказчик сообщает, что оплатил счёт, и прикладывает платёжку или гарантийное письмо."""

from fastapi import UploadFile

from app.blitz.billing.models import Invoice
from app.blitz.billing.schemas import ProofKind
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.documents.services.validators import chosen_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.exceptions import OrderStateError
from app.blitz.orders.services.rules import require_owner
from app.core.clock import now
from app.core.money import format_rub
from models.account import Account

PROOF_KINDS = {
    ProofKind.PAYMENT_ORDER: DocumentKind.PAYMENT_ORDER,
    ProofKind.GUARANTEE_LETTER: DocumentKind.GUARANTEE_LETTER,
}


class ReportInvoicePaidUseCase:
    """Это только сигнал: деньги идут мимо сайта, оплату подтверждает администратор по выписке."""

    def __init__(self, invoices: InvoiceRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.invoices = invoices
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        order: BlitzOrder,
        invoice: Invoice,
        proof: UploadFile | None,
        proof_kind: ProofKind,
    ) -> Invoice:
        """Оплаченный или аннулированный счёт — OrderStateError."""

        require_owner(order, customer)

        if not invoice.is_open:
            raise OrderStateError("Счёт уже оплачен или аннулирован")

        uploads = chosen_files([proof] if proof else [])

        async with self.files.saved(order.id, uploads, PROOF_KINDS[proof_kind], customer.id) as documents:
            order.documents.extend(documents)
            invoice.reported_at = now()
            await self.invoices.save()

        self.notifier.notify_admins(
            order,
            f"Заказчик сообщил об оплате счёта № {invoice.number} на {format_rub(invoice.amount)}. "
            "Проверьте поступление и подтвердите оплату в админке",
        )

        return invoice
