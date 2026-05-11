from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from schemas.order import ALLOWED_DOCUMENT_EXTENSIONS, OrderDocuments

UPLOAD_CHUNK_SIZE = 1024 * 1024
BACKEND_ROOT = Path(__file__).resolve().parents[2]


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
            detail="Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
        )
