"""Счета в админке: список, просмотр и подтверждение оплаты."""

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response

from app.blitz.billing.dependencies import (
    get_admin_invoice,
    get_admin_invoice_order,
    get_confirm_invoice_usecase,
    get_invoice_repository,
)
from app.blitz.billing.models import Invoice
from app.blitz.billing.schemas import AdminInvoiceSchema
from app.blitz.billing.services.pdf import invoice_pdf
from app.blitz.billing.services.repo import InvoiceRepository
from app.blitz.billing.services.usecases.confirm_invoice import ConfirmInvoiceUseCase
from app.blitz.documents.services.download import PDF_TYPE, generated_response
from app.blitz.orders.models import BlitzOrder

router = APIRouter(tags=["admin-blitz"])


@router.get("/invoices")
async def list_invoices(
    only_open: bool = Query(True, alias="open"),
    invoices: InvoiceRepository = Depends(get_invoice_repository),
) -> list[AdminInvoiceSchema]:
    """Счета, новые первыми: по умолчанию только ждущие оплаты."""

    return [AdminInvoiceSchema.model_validate(item) for item in await invoices.list_for_admin(only_open)]


@router.get("/invoices/{invoice_id}/pdf")
async def download_invoice(
    invoice: Invoice = Depends(get_admin_invoice),
    order: BlitzOrder = Depends(get_admin_invoice_order),
) -> Response:
    """Счёт в PDF."""

    content = await invoice_pdf(invoice, order)

    return generated_response(content, f"Счёт {invoice.number}.pdf", PDF_TYPE)


@router.post("/invoices/{invoice_id}/confirm")
async def confirm_invoice(
    invoice: Invoice = Depends(get_admin_invoice),
    order: BlitzOrder = Depends(get_admin_invoice_order),
    usecase: ConfirmInvoiceUseCase = Depends(get_confirm_invoice_usecase),
) -> AdminInvoiceSchema:
    """Деньги пришли: счёт оплачен, заявка идёт дальше."""

    return AdminInvoiceSchema.model_validate(await usecase.execute(order, invoice))
