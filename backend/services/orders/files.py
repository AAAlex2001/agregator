"Сервисный модуль: files."
import shutil
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from schemas.order import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    ALLOWED_DOCUMENT_EXTENSIONS_LABEL,
    MAX_ORDER_DOCUMENTS,
    MAX_ORDER_FILES_TOTAL_BYTES,
    OrderDocuments,
)

UPLOAD_CHUNK_SIZE = 1024 * 1024
BACKEND_ROOT = Path(__file__).resolve().parents[2]


def total_files_size(files: list[UploadFile]) -> int:
    "Публичный метод сервисного слоя."
    return sum(int(file.size or 0) for file in files)


def ensure_total_size_within_limit(*lists: list[UploadFile]) -> None:
    "Бросает HTTPException, если условие не выполнено."
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
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
    ) -> OrderDocuments:
        "Публичный метод сервисного слоя."
        ensure_total_size_within_limit(technical, contract, company, other)
        self.ensure_documents_acceptable(technical, contract, company, other)
        upload_dir = self.dir_for(order_id)
        upload_dir.mkdir(parents=True, exist_ok=True)
        return OrderDocuments(
            technical=[await self.save_one(upload_dir, f, order_id) for f in technical],
            contract=[await self.save_one(upload_dir, f, order_id) for f in contract],
            company=[await self.save_one(upload_dir, f, order_id) for f in company],
            other=[await self.save_one(upload_dir, f, order_id) for f in other],
        )

    @classmethod
    def ensure_documents_acceptable(
        cls,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
    ) -> None:
        "Проверяет количество и расширения всех файлов до записи на диск."
        for files in (technical, contract, company):
            if len(files) > 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="В категории допустим только один файл",
                )
        total = len(technical) + len(contract) + len(company) + len(other)
        if total > MAX_ORDER_DOCUMENTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Не более {MAX_ORDER_DOCUMENTS} файлов на заказ",
            )
        for file in (*technical, *contract, *company, *other):
            cls.ensure_extension_allowed(Path(file.filename or "").suffix.lower())

    def dir_for(self, order_id: int) -> Path:
        "Публичный метод сервисного слоя."
        return BACKEND_ROOT / "uploads" / "orders" / str(order_id)

    def remove_dir(self, order_id: int) -> None:
        "Удаляет каталог файлов заказа с диска."
        shutil.rmtree(self.dir_for(order_id), ignore_errors=True)

    async def save_one(self, upload_dir: Path, file: UploadFile, order_id: int) -> str:
        "Публичный метод сервисного слоя."
        extension = Path(file.filename or "").suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                await handle.write(chunk)

        return f"/uploads/orders/{order_id}/{generated_name}"

    async def copy_documents(
        self,
        source_order_id: int,
        target_order_id: int,
        documents: OrderDocuments,
    ) -> OrderDocuments:
        target_dir = self.dir_for(target_order_id)
        target_dir.mkdir(parents=True, exist_ok=True)

        async def copy_category(paths: list[str]) -> list[str]:
            return [
                await self.copy_one(source_order_id, target_order_id, target_dir, path)
                for path in paths
            ]

        return OrderDocuments(
            technical=await copy_category(documents.technical),
            contract=await copy_category(documents.contract),
            company=await copy_category(documents.company),
            other=await copy_category(documents.other),
        )

    async def copy_one(
        self,
        source_order_id: int,
        target_order_id: int,
        target_dir: Path,
        file_url: str,
    ) -> str:
        source_dir = self.dir_for(source_order_id).resolve()
        source_path = (BACKEND_ROOT / file_url.lstrip("/")).resolve()
        if source_path.parent != source_dir or not source_path.is_file():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Документ исходной заявки не найден",
            )

        extension = source_path.suffix.lower()
        self.ensure_extension_allowed(extension)
        generated_name = f"{uuid4().hex}{extension}"
        target_path = target_dir / generated_name
        async with (
            aiofiles.open(source_path, "rb") as source,
            aiofiles.open(target_path, "wb") as target,
        ):
            while chunk := await source.read(UPLOAD_CHUNK_SIZE):
                await target.write(chunk)
        return f"/uploads/orders/{target_order_id}/{generated_name}"

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if extension in ALLOWED_DOCUMENT_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Допустимые форматы файлов: {ALLOWED_DOCUMENT_EXTENSIONS_LABEL}",
        )
