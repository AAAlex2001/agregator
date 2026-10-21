"""Скачивание любого файла заявки в админке: документация, договор, платёжки."""

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.blitz.documents.services.download import file_response
from app.blitz.documents.services.exceptions import DocumentNotFoundError
from app.blitz.orders.dependencies import get_admin_order
from app.blitz.orders.models import BlitzOrder

router = APIRouter(tags=["admin-blitz"])


@router.get("/orders/{order_id}/documents/{document_id}")
async def download_document(
    document_id: int,
    order: BlitzOrder = Depends(get_admin_order),
) -> FileResponse:
    """Файл заявки."""

    document = next((item for item in order.documents if item.id == document_id), None)
    if document is None:
        raise DocumentNotFoundError

    return file_response(document)
