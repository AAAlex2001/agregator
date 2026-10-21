"""Скачивание файлов заявки её участниками."""

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.auth.sessions.dependencies import require_user
from app.blitz.documents.services.download import file_response
from app.blitz.documents.services.exceptions import DocumentNotFoundError
from app.blitz.orders.dependencies import get_viewed_order
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.presenter import PUBLIC_KINDS, is_party
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.get("/orders/{order_id}/documents/{document_id}")
async def download_document(
    document_id: int,
    order: BlitzOrder = Depends(get_viewed_order),
    user: Account = Depends(require_user),
) -> FileResponse:
    """Файл заявки. Эксперт, который только выбирает заявку, скачивает лишь документацию."""

    document = next((item for item in order.documents if item.id == document_id), None)
    if document is None or not (is_party(order, user) or document.kind in PUBLIC_KINDS):
        raise DocumentNotFoundError

    return file_response(document)
