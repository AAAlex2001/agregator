"Файловое хранилище вложений комнаты экспертов: общие проверки с обычным чатом."
from datetime import UTC, datetime
from pathlib import Path

from fastapi import UploadFile

from schemas.chat import ChatAttachmentData
from services.chats.file_storage import (
    BACKEND_ROOT,
    ensure_attachment_extension,
    ensure_attachments_limit,
    write_attachment,
)


class ExpertRoomFileStorage:
    "Сохраняет вложения сообщений чата экспертов в помесячные каталоги."

    async def save(self, uploads: list[UploadFile]) -> list[ChatAttachmentData]:
        "Сохраняет файл/сущность."
        ensure_attachments_limit(uploads)
        for upload in uploads:
            ensure_attachment_extension(Path(upload.filename or "").suffix.lower())
        month_dir = self.current_month_dir()
        upload_dir = BACKEND_ROOT / "uploads" / "expert-room" / month_dir
        upload_dir.mkdir(parents=True, exist_ok=True)

        return [
            await write_attachment(upload_dir, upload, f"/uploads/expert-room/{month_dir}")
            for upload in uploads
        ]

    @staticmethod
    def current_month_dir() -> str:
        "Каталог месяца в формате ГГГГ-ММ."
        now = datetime.now(UTC)
        return f"{now.year:04d}-{now.month:02d}"
