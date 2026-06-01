from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from schemas.order import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    ALLOWED_DOCUMENT_EXTENSIONS_LABEL,
    MAX_ORDER_FILES_TOTAL_BYTES,
    OrderDocuments,
)

UPLOAD_CHUNK_SIZE = 1024 * 1024
BACKEND_ROOT = Path(__file__).resolve().parents[2]


def total_files_size(files: list[UploadFile]) -> int:
    return sum(int(file.size or 0) for file in files)


def ensure_total_size_within_limit(*lists: list[UploadFile]) -> None:
    total = sum(total_files_size(items) for items in lists)
    if total <= MAX_ORDER_FILES_TOTAL_BYTES:
        return
    max_mb = MAX_ORDER_FILES_TOTAL_BYTES // (1024 * 1024)
    raise HTTPException(
        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        detail=f"Суммарный размер загружаемых файлов не должен превышать {max_mb} МБ",
    )


class OrderFileStorage:
    "Хранение файлов заказов на диске. IO отделено от БД."

    async def save_documents(
        self,
        order_id: int,
        *,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
    ) -> OrderDocuments:
        ensure_total_size_within_limit(technical, contract, company, other)
        upload_dir = self.dir_for(order_id)
        upload_dir.mkdir(parents=True, exist_ok=True)
        return OrderDocuments(
            technical=[await self.save_one(upload_dir, f, order_id) for f in technical],
            contract=[await self.save_one(upload_dir, f, order_id) for f in contract],
            company=[await self.save_one(upload_dir, f, order_id) for f in company],
            other=[await self.save_one(upload_dir, f, order_id) for f in other],
        )

    def dir_for(self, order_id: int) -> Path:
        return BACKEND_ROOT / "uploads" / "orders" / str(order_id)

    async def save_one(self, upload_dir: Path, file: UploadFile, order_id: int) -> str:
        extension = Path(file.filename or "").suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                await handle.write(chunk)

        return f"/uploads/orders/{order_id}/{generated_name}"

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        if extension in ALLOWED_DOCUMENT_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Допустимые форматы файлов: {ALLOWED_DOCUMENT_EXTENSIONS_LABEL}",
        )
