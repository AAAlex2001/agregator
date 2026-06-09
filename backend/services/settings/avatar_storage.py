"Файловое хранилище: сохранение/удаление файлов на диске."
import asyncio
import logging
from pathlib import Path, PurePosixPath
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from models.user import User
from utils.image_validation import extension_matches_image_bytes

AVATAR_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
AVATAR_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
AVATAR_MAX_SIZE = 5 * 1024 * 1024
UPLOAD_CHUNK_SIZE = 1024 * 1024
BACKEND_ROOT = Path(__file__).resolve().parents[2]

logger = logging.getLogger(__name__)


class AvatarStorage:
    "Сохраняет аватар на диск, чистит предыдущий, валидирует тип и размер."

    @staticmethod
    def validate_upload(filename: str, content_type: str) -> str:
        "Валидирует переданные данные."
        extension = Path(filename).suffix.lower()
        if extension not in AVATAR_ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Можно загрузить только JPG или PNG размером до 5 МБ",
            )
        normalized_ct = (content_type or "").lower()
        if normalized_ct and normalized_ct not in AVATAR_ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Можно загрузить только JPG или PNG размером до 5 МБ",
            )
        return extension

    @classmethod
    async def save(cls, user: User, file: UploadFile) -> str:
        "Сохраняет файл/сущность."
        extension = cls.validate_upload(file.filename or "", file.content_type or "")

        upload_dir = BACKEND_ROOT / "uploads" / "avatars" / str(user.id)
        await asyncio.to_thread(upload_dir.mkdir, parents=True, exist_ok=True)

        generated_name = f"{uuid4().hex}{extension}"
        file_path = upload_dir / generated_name
        previous_path: Path | None = None

        if user.avatar_url and user.avatar_url.startswith(f"/uploads/avatars/{user.id}/"):
            relative_subpath = PurePosixPath(user.avatar_url).relative_to("/")
            candidate = Path(BACKEND_ROOT, *relative_subpath.parts).resolve()
            uploads_root = Path(BACKEND_ROOT, "uploads").resolve()
            if uploads_root in candidate.parents:
                previous_path = candidate
            else:
                logger.warning("Отклонён путь предыдущего аватара вне uploads: %s", user.avatar_url)

        total = 0
        header_checked = False
        try:
            async with aiofiles.open(file_path, "wb") as out:
                while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                    if not header_checked:
                        if not extension_matches_image_bytes(extension, chunk[:12]):
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Содержимое файла не соответствует изображению",
                            )
                        header_checked = True
                    total += len(chunk)
                    if total > AVATAR_MAX_SIZE:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Размер фото не должен превышать 5 МБ",
                        )
                    await out.write(chunk)
        except HTTPException:
            file_path.unlink(missing_ok=True)
            raise
        finally:
            await file.close()

        new_url = f"/uploads/avatars/{user.id}/{generated_name}"

        if previous_path and previous_path.exists() and previous_path != file_path:
            previous_path.unlink(missing_ok=True)

        return new_url
