"Синхронное сохранение вложений к тикетам поддержки в общий с бэкендом том /app/uploads/support/."

from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import UploadFile

SUPPORT_FILE_EXTENSIONS = {".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx"}
SUPPORT_MAX_FILE_SIZE = 100 * 1024 * 1024
SUPPORT_MAX_FILES = 6
SUPPORT_UPLOADS_ROOT = Path("/app/uploads/support")


def save_support_attachments_sync(ticket_id: int, files: list[UploadFile]) -> list[dict[str, Any]]:
    "Синхронно сохраняет файлы тикета в общий с бэкендом том /app/uploads/support/{ticket_id}/."
    saved: list[dict[str, Any]] = []
    valid = [f for f in files if f and f.filename]
    if not valid:
        return saved
    if len(valid) > SUPPORT_MAX_FILES:
        valid = valid[:SUPPORT_MAX_FILES]

    upload_dir = SUPPORT_UPLOADS_ROOT / str(ticket_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    for upload in valid:
        original_name = upload.filename or "file"
        extension = Path(original_name).suffix.lower()
        if extension not in SUPPORT_FILE_EXTENSIONS:
            continue
        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        with open(full_path, "wb") as out:
            chunk = upload.file.read(1024 * 1024)
            total = 0
            while chunk:
                total += len(chunk)
                if total > SUPPORT_MAX_FILE_SIZE:
                    out.close()
                    full_path.unlink(missing_ok=True)
                    break
                out.write(chunk)
                chunk = upload.file.read(1024 * 1024)
            else:
                saved.append({
                    "name": original_name,
                    "url": f"/uploads/support/{ticket_id}/{generated_name}",
                })
    return saved
