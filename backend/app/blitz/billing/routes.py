"""Счета и акт в кабинете заказчика."""

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import Response

from app.auth.sessions.dependencies import require_user
from app.blitz.billing.dependencies import (
    get_invoice_repository,
    get_issue_invoice_usecase,
    get_locked_invoice,
    get_report_invoice_paid_usecase,
    get_viewed_invoice,
)
from app.blitz.billing.models import Invoice
from app.blitz.billing.schemas import InvoiceSchema, ProofKind
from app.blitz.billing.services.pdf import act_number, act_pdf, invoice_pdf
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.billing.services.usecases.issue_invoice import IssueInvoiceUseCase
from app.blitz.billing.services.usecases.report_invoice_paid import ReportInvoicePaidUseCase
from app.blitz.documents.services.download import PDF_TYPE, generated_response
from app.blitz.orders.dependencies import get_locked_order, get_viewed_order
from app.blitz.orders.models import BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import OrderNotFoundError, OrderStateError
from app.blitz.orders.services.rules import require_owner
from app.blitz.orders.services.validators import require_customer
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.get("/invoices")
async def list_my_invoices(
    user: Account = Depends(require_user),
    invoices: InvoiceRepository = Depends(get_invoice_repository),
) -> list[InvoiceSchema]:
    """Счета заказчика по всем заявкам."""

    require_customer(user)

    return [InvoiceSchema.model_validate(item) for item in await invoices.list_for_customer(user.id)]


@router.post("/orders/{order_id}/invoice")
async def issue_invoice(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: IssueInvoiceUseCase = Depends(get_issue_invoice_usecase),
) -> InvoiceSchema:
    """Счёт на текущий этап оплаты."""

    return InvoiceSchema.model_validate(await usecase.execute(user, order))


@router.post("/orders/{order_id}/invoices/{invoice_id}/paid")
async def report_invoice_paid(
    proof_kind: ProofKind = Form(ProofKind.PAYMENT_ORDER),
    proof: UploadFile | None = File(None),
    order: BlitzOrder = Depends(get_locked_order),
    invoice: Invoice = Depends(get_locked_invoice),
    user: Account = Depends(require_user),
    usecase: ReportInvoicePaidUseCase = Depends(get_report_invoice_paid_usecase),
) -> InvoiceSchema:
    """Заказчик сообщает об оплате и прикладывает платёжку или гарантийное письмо."""

    return InvoiceSchema.model_validate(await usecase.execute(user, order, invoice, proof, proof_kind))


@router.get("/orders/{order_id}/invoices/{invoice_id}/pdf")
async def download_invoice(
    order: BlitzOrder = Depends(get_viewed_order),
    invoice: Invoice = Depends(get_viewed_invoice),
    user: Account = Depends(require_user),
) -> Response:
    """Счёт в PDF."""

    if order.customer_id != user.id:
        raise OrderNotFoundError

    content = await invoice_pdf(invoice, order)

    return generated_response(content, f"Счёт {invoice.number}.pdf", PDF_TYPE)


@router.get("/orders/{order_id}/act")
async def download_act(
    order: BlitzOrder = Depends(get_viewed_order),
    user: Account = Depends(require_user),
) -> Response:
    """Акт сдачи-приёмки после принятия работы."""

    require_owner(order, user)

    if order.status != OrderStatus.ACCEPTED:
        raise OrderStateError("Акт появится после приёмки работы")

    content = await act_pdf(order)

    return generated_response(content, f"Акт {act_number(order)}.pdf", PDF_TYPE)
