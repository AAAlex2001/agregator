"Сохраняет файл лицензии (PDF/JPG/PNG) на диск под uploads/licenses/<owner_key>/."
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}
MAX_SIZE = 5 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024

BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _validate(extension: str, content_type: str) -> None:
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Допустимые форматы файла лицензии: PDF, JPG, PNG",
        )
    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимый тип файла лицензии",
        )


async def save_license_file(owner_key: str, file: UploadFile) -> str:
    """Сохраняет загруженный файл и возвращает публичный URL."""
    extension = Path(file.filename or "").suffix.lower()
    _validate(extension, (file.content_type or "").lower())

    upload_dir = BACKEND_ROOT / "uploads" / "licenses" / owner_key
    upload_dir.mkdir(parents=True, exist_ok=True)

    generated_name = f"{uuid4().hex}{extension}"
    full_path = upload_dir / generated_name
    written = 0

    try:
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(CHUNK_SIZE):
                written += len(chunk)
                if written > MAX_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Размер файла лицензии не должен превышать 5 МБ",
                    )
                await handle.write(chunk)
    except HTTPException:
        full_path.unlink(missing_ok=True)
        raise
    finally:
        await file.close()

    return f"/uploads/licenses/{owner_key}/{generated_name}"


def remove_license_file(file_url: str | None) -> None:
    if not file_url:
        return
    (BACKEND_ROOT / file_url.lstrip("/")).unlink(missing_ok=True)
