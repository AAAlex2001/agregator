"""Файлы аудита: только PDF, электронная подпись, фото и видео — Word и Excel аудитор не примет."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import UploadFile

from app.blitz.audit.checklist import AUDIT_DOCUMENTS
from app.blitz.documents.models import DocumentKind, OrderDocument
from app.blitz.documents.services.storage import AUDIT_EXTENSIONS, AUDIT_FILE_SIZE_MB, OrderFiles
from app.blitz.orders.services.exceptions import InvalidOrderError


def check_items(uploads: list[UploadFile], items: list[int]) -> None:
    """У каждого файла номер пункта перечня. Иначе InvalidOrderError."""

    if len(uploads) != len(items):
        raise InvalidOrderError("Для каждого файла нужен номер пункта перечня")

    for number in items:
        if not 1 <= number <= len(AUDIT_DOCUMENTS):
            raise InvalidOrderError(f"В перечне нет пункта {number}")


@asynccontextmanager
async def saved_audit_files(
    files: OrderFiles,
    order_id: int,
    uploads: list[UploadFile],
    kind: DocumentKind,
    uploaded_by: int,
) -> AsyncIterator[list[OrderDocument]]:
    """Файлы аудита сохраняются на входе и удаляются, если блок внутри не выполнился."""

    async with files.saved(
        order_id,
        uploads,
        kind,
        uploaded_by,
        AUDIT_EXTENSIONS,
        AUDIT_FILE_SIZE_MB,
    ) as documents:
        yield documents


@asynccontextmanager
async def saved_checklist_files(
    files: OrderFiles,
    order_id: int,
    uploads: list[UploadFile],
    items: list[int],
    uploaded_by: int,
) -> AsyncIterator[list[OrderDocument]]:
    """Документы по перечню с номерами пунктов."""

    check_items(uploads, items)

    async with saved_audit_files(files, order_id, uploads, DocumentKind.AUDIT_ITEM, uploaded_by) as documents:
        for document, number in zip(documents, items, strict=True):
            document.item_number = number

        yield documents
