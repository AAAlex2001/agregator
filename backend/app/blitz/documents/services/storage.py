"""Файлы заявки на диске: private_uploads/blitz/<номер заявки>/."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind, OrderDocument
from app.core.private_files import remove_private, save_private, write_private

DOCUMENT_EXTENSIONS = frozenset(
    {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".zip", ".rar"},
)
SIGNED_EXTENSIONS = DOCUMENT_EXTENSIONS | {".sig", ".p7s"}
MAX_FILE_SIZE_MB = 50


def order_folder(order_id: int) -> str:
    """Папка файлов заявки."""

    return f"blitz/{order_id}"


class OrderFiles:
    """Сохраняет и удаляет файлы заявки."""

    @asynccontextmanager
    async def saved(
        self,
        order_id: int,
        uploads: list[UploadFile],
        kind: DocumentKind,
        uploaded_by: int,
        extensions: frozenset[str] = DOCUMENT_EXTENSIONS,
    ) -> AsyncIterator[list[OrderDocument]]:
        """Файлы сохраняются на входе и удаляются, если блок внутри не выполнился."""

        documents: list[OrderDocument] = []

        try:
            for upload in uploads:
                stored = await save_private(upload, order_folder(order_id), extensions, MAX_FILE_SIZE_MB)
                documents.append(
                    OrderDocument(
                        uploaded_by=uploaded_by,
                        kind=kind,
                        path=stored.path,
                        name=stored.name,
                        size=stored.size,
                    )
                )

            yield documents
        except Exception:
            self.remove(documents)
            raise

    def generated(
        self,
        order_id: int,
        content: bytes,
        name: str,
        kind: DocumentKind,
        by: int,
    ) -> OrderDocument:
        """Документ, который собрал сервер: договор или соглашение."""

        stored = write_private(content, order_folder(order_id), name)

        return OrderDocument(uploaded_by=by, kind=kind, path=stored.path, name=stored.name, size=stored.size)

    def remove(self, documents: list[OrderDocument]) -> None:
        """Удалить файлы с диска."""

        for document in documents:
            remove_private(document.path)
