"Файловое хранилище вложений чатов: проверка расширения, количества и размера."
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
MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

BACKEND_ROOT = Path(__file__).resolve().parents[2]


def ensure_attachments_limit(uploads: list[UploadFile]) -> None:
    "Бросает 400, если вложений больше лимита."
    if len(uploads) <= MAX_ATTACHMENTS:
        return
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Можно прикрепить не больше {MAX_ATTACHMENTS} файлов",
    )


def ensure_attachment_extension(extension: str) -> None:
    "Бросает 400 на недопустимое расширение файла."
    if extension in ALLOWED_EXTENSIONS:
        return
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Допустимые форматы файлов: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
    )


async def write_attachment(
    upload_dir: Path, upload: UploadFile, url_prefix: str
) -> ChatAttachmentData:
    "Пишет вложение на диск чанками; превышение размера удаляет недописанный файл."
    extension = Path(upload.filename or "").suffix.lower()
    generated_name = f"{uuid4().hex}{extension}"
    full_path = upload_dir / generated_name

    written = 0
    async with aiofiles.open(full_path, "wb") as handle:
        while chunk := await upload.read(UPLOAD_CHUNK_SIZE):
            written += len(chunk)
            if written > MAX_ATTACHMENT_BYTES:
                break
            await handle.write(chunk)
    if written > MAX_ATTACHMENT_BYTES:
        full_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Размер файла не должен превышать {MAX_ATTACHMENT_BYTES // (1024 * 1024)} МБ",
        )

    return ChatAttachmentData(
        url=f"{url_prefix}/{generated_name}",
        name=sanitize_filename(upload.filename, fallback=generated_name),
    )


class ChatFileStorage:
    "Сохраняет вложения чата в каталог заказа."

    async def save(
        self, chat_id: int, uploads: list[UploadFile]
    ) -> list[ChatAttachmentData]:
        "Сохраняет файл/сущность."
        ensure_attachments_limit(uploads)
        for upload in uploads:
            ensure_attachment_extension(Path(upload.filename or "").suffix.lower())
        upload_dir = BACKEND_ROOT / "uploads" / "chats" / str(chat_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        return [
            await write_attachment(upload_dir, upload, f"/uploads/chats/{chat_id}")
            for upload in uploads
        ]
