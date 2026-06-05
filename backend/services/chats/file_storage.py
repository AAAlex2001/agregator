"Файловое хранилище: сохранение/удаление файлов на диске."
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from schemas.chat import ChatAttachmentData
from utils.filenames import sanitize_filename

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpeg",
    ".jpg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
}
UPLOAD_CHUNK_SIZE = 1024 * 1024
MAX_ATTACHMENTS = 6

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class ChatFileStorage:
    "Сохраняет вложения чата. Проверяет расширение и лимит количества."

    async def save(
        self, chat_id: int, uploads: list[UploadFile]
    ) -> list[ChatAttachmentData]:
        "Сохраняет файл/сущность."
        self.ensure_limit(uploads)
        upload_dir = BACKEND_ROOT / "uploads" / "chats" / str(chat_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        return [await self.save_one(upload_dir, upload, chat_id) for upload in uploads]

    async def save_one(
        self, upload_dir: Path, upload: UploadFile, chat_id: int
    ) -> ChatAttachmentData:
        "Публичный метод сервисного слоя."
        extension = Path(upload.filename or "").suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await upload.read(UPLOAD_CHUNK_SIZE):
                await handle.write(chunk)

        return ChatAttachmentData(
            url=f"/uploads/chats/{chat_id}/{generated_name}",
            name=sanitize_filename(upload.filename, fallback=generated_name),
        )

    @staticmethod
    def ensure_limit(uploads: list[UploadFile]) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if len(uploads) <= MAX_ATTACHMENTS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Можно прикрепить не больше {MAX_ATTACHMENTS} файлов",
        )

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if extension in ALLOWED_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
        )
