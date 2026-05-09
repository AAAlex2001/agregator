from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from models.user import User


AVATAR_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
AVATAR_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
AVATAR_MAX_SIZE = 5 * 1024 * 1024
UPLOAD_CHUNK_SIZE = 1024 * 1024


class AvatarStorage:
    "Сохраняет аватар на диск, чистит предыдущий, валидирует тип и размер."

    @staticmethod
    def _validate(filename: str, content_type: str) -> str:
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
        extension = cls._validate(file.filename or "", file.content_type or "")

        upload_dir = Path(__file__).resolve().parents[2] / "uploads" / "avatars" / str(user.id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        generated_name = f"{uuid4().hex}{extension}"
        file_path = upload_dir / generated_name
        previous_path: Path | None = None

        if user.avatar_url and user.avatar_url.startswith(f"/uploads/avatars/{user.id}/"):
            previous_path = Path(__file__).resolve().parents[2] / user.avatar_url.lstrip("/")

        total = 0
        try:
            async with aiofiles.open(file_path, "wb") as out:
                while chunk := await file.read(UPLOAD_CHUNK_SIZE):
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
