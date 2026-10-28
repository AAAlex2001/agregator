from io import BytesIO
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import UploadFile
from PIL import Image, ImageOps

from src.core.config import UPLOADS_DIR
from src.poster.posts.exceptions import MediaTooLargeError, WrongMediaTypeError
from src.poster.posts.models import MediaKind

MEGABYTE = 1024 * 1024
MAX_PHOTO_SIZE = 10 * MEGABYTE
MAX_VIDEO_SIZE = 50 * MEGABYTE
PHOTO_EXTENSIONS = {"JPEG": ".jpg", "MPO": ".jpg", "PNG": ".png", "WEBP": ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".mov"}


class MediaStorage:
    """Фото и видео постов на диске: uploads/posts/<случайное имя>."""

    async def save(self, file: UploadFile) -> tuple[MediaKind, str]:
        """Проверяет и сохраняет файл. Возвращает вид файла и путь внутри uploads."""
        if (file.content_type or "").startswith("video/"):
            return MediaKind.VIDEO, await self.save_video(file)

        return MediaKind.PHOTO, await self.save_photo(file)

    async def save_photo(self, file: UploadFile) -> str:
        """Сохраняет фото повёрнутым как надо и без метаданных: в них бывает место съёмки."""
        if (file.size or 0) > MAX_PHOTO_SIZE:
            raise MediaTooLargeError("Фото больше 10 МБ")

        content = await file.read()

        try:
            image = Image.open(BytesIO(content))
            photo_format = image.format
            upright_image = ImageOps.exif_transpose(image)
        except (OSError, Image.DecompressionBombError) as error:
            raise WrongMediaTypeError() from error

        if photo_format not in PHOTO_EXTENSIONS:
            raise WrongMediaTypeError()

        cleaned_photo = BytesIO()
        upright_image.save(cleaned_photo, format="JPEG" if photo_format == "MPO" else photo_format)

        path = new_path(PHOTO_EXTENSIONS[photo_format])
        await write_file(path, cleaned_photo.getvalue())

        return path

    async def save_video(self, file: UploadFile) -> str:
        """Сохраняет видео MP4 или MOV. У таких файлов на 4–8 байте записано слово ftyp."""
        if (file.size or 0) > MAX_VIDEO_SIZE:
            raise MediaTooLargeError("Видео больше 50 МБ")

        extension = Path(file.filename or "").suffix.lower()
        content = await file.read()

        if extension not in VIDEO_EXTENSIONS or content[4:8] != b"ftyp":
            raise WrongMediaTypeError()

        path = new_path(extension)
        await write_file(path, content)

        return path

    def delete(self, paths: list[str]) -> None:
        """Удаляет файлы с диска. Если файла уже нет — ничего страшного."""
        for path in paths:
            (UPLOADS_DIR / path).unlink(missing_ok=True)


def new_path(extension: str) -> str:
    """Придумывает случайное имя для нового файла в папке posts."""
    return f"posts/{uuid4().hex}{extension}"


async def write_file(path: str, content: bytes) -> None:
    """Записывает файл на диск, создавая папку, если её нет."""
    full_path = UPLOADS_DIR / path
    full_path.parent.mkdir(parents=True, exist_ok=True)

    async with aiofiles.open(full_path, "wb") as file:
        await file.write(content)
