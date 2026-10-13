"""Сохранение загруженных картинок и видео в каталог uploads на сервере."""

import asyncio
from io import BytesIO
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from services.posts.config import UPLOADS_DIR

MEGABYTE = 1024 * 1024
IMAGE_EXTENSIONS = {"JPEG": ".jpg", "MPO": ".jpg", "PNG": ".png", "WEBP": ".webp"}
JPEG_QUALITY = 90


class UploadError(ValueError):
    """Файл не подходит: неверный формат или превышен размер."""


def detect_extension(content: bytes) -> str:
    """Определить формат картинки по содержимому, а не по заголовку от клиента."""

    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()
            image_format = image.format
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError, SyntaxError) as error:
        raise UploadError("Файл не является изображением") from error

    extension = IMAGE_EXTENSIONS.get(image_format or "")
    if extension is None:
        raise UploadError("Допустимы только JPEG, PNG и WebP")

    return extension


def strip_metadata(content: bytes) -> bytes:
    """Пересохранить картинку без EXIF и XMP: в фото с телефона там координаты места съёмки.

    Фото с айфона Pillow видит как MPO — это JPEG с доп. кадрами. Сохраняется обычный JPEG.
    """

    with Image.open(BytesIO(content)) as image:
        image_format = "JPEG" if image.format == "MPO" else image.format
        icc_profile = image.info.get("icc_profile")

        upright = ImageOps.exif_transpose(image)
        upright.info.clear()

        output = BytesIO()
        upright.save(output, format=image_format, icc_profile=icc_profile, quality=JPEG_QUALITY)

    return output.getvalue()


async def save_image(file: UploadFile, max_size: int) -> str:
    """Проверяет фото и сохраняет его без метаданных в uploads/posts."""

    content = await file.read(max_size + 1)
    if len(content) > max_size:
        raise UploadError(f"Фото больше {max_size // MEGABYTE} МБ")

    extension = await asyncio.to_thread(detect_extension, content)
    cleaned = await asyncio.to_thread(strip_metadata, content)

    directory = UPLOADS_DIR / "posts"
    directory.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid4().hex}{extension}"
    await asyncio.to_thread((directory / filename).write_bytes, cleaned)

    return f"posts/{filename}"


async def save_video(file: UploadFile, max_size: int) -> str:
    """Сохраняет MP4/MOV в uploads/posts с проверкой размера и заголовка."""

    if file.size is not None and file.size > max_size:
        raise UploadError(f"Видео больше {max_size // MEGABYTE} МБ")

    head = await file.read(12)
    if head[4:8] != b"ftyp":
        raise UploadError("Допустимо только видео MP4 или MOV")

    directory = UPLOADS_DIR / "posts"
    directory.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid4().hex}.mp4"
    await file.seek(0)
    path = directory / filename
    total = 0
    try:
        with path.open("wb") as output:
            while chunk := await file.read(MEGABYTE):
                total += len(chunk)
                if total > max_size:
                    raise UploadError(f"Видео больше {max_size // MEGABYTE} МБ")
                await asyncio.to_thread(output.write, chunk)
    except BaseException:
        path.unlink(missing_ok=True)
        raise

    return f"posts/{filename}"


def remove_file(path: str) -> None:
    """Удаляет файл публикации, если он ещё существует."""

    file_path = (UPLOADS_DIR / path).resolve()
    if not file_path.is_relative_to(UPLOADS_DIR.resolve() / "posts"):
        raise ValueError("Файл должен находиться в папке публикаций")
    file_path.unlink(missing_ok=True)
