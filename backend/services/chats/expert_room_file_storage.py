from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from schemas.chat import ChatAttachmentData
from services.chats.file_storage import (
    ALLOWED_EXTENSIONS,
    BACKEND_ROOT,
    MAX_ATTACHMENTS,
    UPLOAD_CHUNK_SIZE,
)
from utils.filenames import sanitize_filename


class ExpertRoomFileStorage:
    "Сохраняет вложения для сообщений чата экспертов. Те же ограничения, что и в обычном чате."

    async def save(self, uploads: list[UploadFile]) -> list[ChatAttachmentData]:
        self.ensure_limit(uploads)
        upload_dir = BACKEND_ROOT / "uploads" / "expert-room" / self.current_month_dir()
        upload_dir.mkdir(parents=True, exist_ok=True)

        return [await self.save_one(upload_dir, upload) for upload in uploads]

    async def save_one(
        self, upload_dir: Path, upload: UploadFile
    ) -> ChatAttachmentData:
        extension = Path(upload.filename or "").suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await upload.read(UPLOAD_CHUNK_SIZE):
                await handle.write(chunk)

        return ChatAttachmentData(
            url=f"/uploads/expert-room/{upload_dir.name}/{generated_name}",
            name=sanitize_filename(upload.filename, fallback=generated_name),
        )

    @staticmethod
    def current_month_dir() -> str:
        now = datetime.now(UTC)
        return f"{now.year:04d}-{now.month:02d}"

    @staticmethod
    def ensure_limit(uploads: list[UploadFile]) -> None:
        if len(uploads) <= MAX_ATTACHMENTS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Можно прикрепить не больше {MAX_ATTACHMENTS} файлов",
        )

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        if extension in ALLOWED_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
        )
