"""Счета: репозиторий, сценарии и счёт заявки по id из пути."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.billing.models import Invoice
from app.blitz.billing.services.exceptions import InvoiceNotFoundError
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.billing.services.usecases.confirm_invoice import ConfirmInvoiceUseCase
from app.blitz.billing.services.usecases.issue_invoice import IssueInvoiceUseCase
from app.blitz.billing.services.usecases.report_invoice_paid import ReportInvoicePaidUseCase
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_locked_order, get_order_repository, get_viewed_order
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.exceptions import OrderNotFoundError
from app.blitz.orders.services.repo import OrderRepository
from app.core.database import get_db


def get_invoice_repository(db: AsyncSession = Depends(get_db)) -> InvoiceRepository:
    """Репозиторий счетов с сессией текущего запроса."""

    return InvoiceRepository(db)


def invoice_of(order: BlitzOrder, invoice_id: int) -> Invoice:
    """Счёт этой заявки. Чужой — InvoiceNotFoundError."""

    invoice = next((item for item in order.invoices if item.id == invoice_id), None)
    if invoice is None:
        raise InvoiceNotFoundError

    return invoice


def get_viewed_invoice(invoice_id: int, order: BlitzOrder = Depends(get_viewed_order)) -> Invoice:
    """Счёт заявки, которую пользователю можно смотреть."""

    return invoice_of(order, invoice_id)


def get_locked_invoice(invoice_id: int, order: BlitzOrder = Depends(get_locked_order)) -> Invoice:
    """Счёт заявки, заблокированной для действия."""

    return invoice_of(order, invoice_id)


async def get_admin_invoice(
    invoice_id: int,
    invoices: InvoiceRepository = Depends(get_invoice_repository),
) -> Invoice:
    """Любой счёт для админки."""

    invoice = await invoices.get(invoice_id)
    if invoice is None:
        raise InvoiceNotFoundError

    return invoice


async def get_admin_invoice_order(
    invoice: Invoice = Depends(get_admin_invoice),
    orders: OrderRepository = Depends(get_order_repository),
) -> BlitzOrder:
    """Заявка счёта, заблокированная до конца запроса."""

    order = await orders.get_for_update(invoice.order_id)
    if order is None:
        raise OrderNotFoundError

    return order


def get_issue_invoice_usecase(
    invoices: InvoiceRepository = Depends(get_invoice_repository),
) -> IssueInvoiceUseCase:
    """Выставление счёта."""

    return IssueInvoiceUseCase(invoices)


def get_report_invoice_paid_usecase(
    invoices: InvoiceRepository = Depends(get_invoice_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ReportInvoicePaidUseCase:
    """Заявление заказчика об оплате."""

    return ReportInvoicePaidUseCase(invoices, OrderFiles(), notifier)


def get_confirm_invoice_usecase(
    invoices: InvoiceRepository = Depends(get_invoice_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ConfirmInvoiceUseCase:
    """Подтверждение оплаты администратором."""

    return ConfirmInvoiceUseCase(invoices, notifier)
