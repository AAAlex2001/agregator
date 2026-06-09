"Универсальное сохранение файлов на диск под uploads/<subdir>/<owner_key>/."
import logging
from pathlib import Path, PurePosixPath
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

CHUNK_SIZE = 1024 * 1024
DEFAULT_MAX_SIZE = 5 * 1024 * 1024

BACKEND_ROOT = Path(__file__).resolve().parents[1]

logger = logging.getLogger(__name__)


async def save_uploaded_file(
    subdir: str,
    owner_key: str,
    file: UploadFile,
    allowed_extensions: set[str],
    allowed_content_types: set[str],
    max_size: int = DEFAULT_MAX_SIZE,
    bad_format_message: str = "Недопустимый формат файла",
    too_large_message: str = "Файл слишком большой",
) -> str:
    "Публичный метод сервисного слоя."
    extension = Path(file.filename or "").suffix.lower()
    content_type = (file.content_type or "").lower()

    if extension not in allowed_extensions or (content_type and content_type not in allowed_content_types):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=bad_format_message,
        )

    upload_dir = BACKEND_ROOT / "uploads" / subdir / owner_key
    upload_dir.mkdir(parents=True, exist_ok=True)

    generated_name = f"{uuid4().hex}{extension}"
    full_path = upload_dir / generated_name
    written = 0

    try:
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(CHUNK_SIZE):
                written += len(chunk)
                if written > max_size:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=too_large_message,
                    )
                await handle.write(chunk)
    except HTTPException:
        full_path.unlink(missing_ok=True)
        raise
    finally:
        await file.close()

    return f"/uploads/{subdir}/{owner_key}/{generated_name}"


def remove_uploaded_file(file_url: str | None) -> None:
    "Удаляет ресурс."
    if not file_url:
        return
    relative_subpath = PurePosixPath(file_url).relative_to("/") if file_url.startswith("/") else PurePosixPath(file_url)
    resolved_path = Path(BACKEND_ROOT, *relative_subpath.parts).resolve()
    uploads_root = Path(BACKEND_ROOT, "uploads").resolve()
    if uploads_root not in resolved_path.parents and resolved_path != uploads_root:
        logger.warning("Отклонено удаление вне uploads: %s", file_url)
        return
    resolved_path.unlink(missing_ok=True)
