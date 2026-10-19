"""Фото и видео постов на диске: uploads/posts/<случайное имя>."""

import asyncio
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.uploads import UPLOADS_DIR
from app.poster.media.services.exceptions import UploadError

FOLDER = "posts"
MEGABYTE = 1024 * 1024
JPEG_QUALITY = 90
IMAGE_EXTENSIONS = {"JPEG": ".jpg", "MPO": ".jpg", "PNG": ".png", "WEBP": ".webp"}
VIDEO_BRANDS = {
    b"isom",
    b"iso2",
    b"iso3",
    b"iso4",
    b"iso5",
    b"iso6",
    b"mp41",
    b"mp42",
    b"avc1",
    b"M4V ",
    b"qt  ",
    b"dash",
}


def is_video_header(head: bytes) -> bool:
    """MP4 или MOV по первым 12 байтам. HEIC и AVIF с тем же контейнером ftyp не подходят."""

    return head[4:8] == b"ftyp" and head[8:12] in VIDEO_BRANDS


def image_extension(content: bytes) -> str:
    """Расширение по содержимому картинки, а не по заголовку от клиента."""

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


def without_metadata(content: bytes) -> bytes:
    """Картинка без EXIF и XMP: в фото с телефона там координаты места съёмки.

    Фото с айфона Pillow видит как MPO — это JPEG с доп. кадрами, сохраняется обычный JPEG.
    """

    with Image.open(BytesIO(content)) as image:
        image_format = "JPEG" if image.format == "MPO" else image.format
        icc_profile = image.info.get("icc_profile")

        upright = ImageOps.exif_transpose(image)
        upright.info.clear()

        output = BytesIO()
        upright.save(output, format=image_format, icc_profile=icc_profile, quality=JPEG_QUALITY)

    return output.getvalue()


def new_path(extension: str) -> str:
    """Путь нового файла относительно uploads; папка создаётся."""

    (UPLOADS_DIR / FOLDER).mkdir(parents=True, exist_ok=True)

    return f"{FOLDER}/{uuid4().hex}{extension}"


async def save_image(file: UploadFile, max_size: int) -> str:
    """Проверяет фото и сохраняет его без метаданных. Возвращает путь относительно uploads."""

    content = await file.read(max_size + 1)
    if len(content) > max_size:
        raise UploadError(f"Фото больше {max_size // MEGABYTE} МБ")

    extension = await asyncio.to_thread(image_extension, content)
    cleaned = await asyncio.to_thread(without_metadata, content)

    path = new_path(extension)
    await asyncio.to_thread((UPLOADS_DIR / path).write_bytes, cleaned)

    return path


async def save_video(file: UploadFile, max_size: int) -> str:
    """Сохраняет MP4/MOV частями с проверкой размера. Возвращает путь относительно uploads."""

    too_large = UploadError(f"Видео больше {max_size // MEGABYTE} МБ")
    if file.size is not None and file.size > max_size:
        raise too_large

    if not is_video_header(await file.read(12)):
        raise UploadError("Допустимо только видео MP4 или MOV")

    await file.seek(0)
    path = new_path(".mp4")
    full_path = UPLOADS_DIR / path

    try:
        fits = await write_limited(file, full_path, max_size)
    except BaseException:
        full_path.unlink(missing_ok=True)
        raise

    if not fits:
        full_path.unlink(missing_ok=True)
        raise too_large

    return path


async def write_limited(file: UploadFile, full_path: Path, max_size: int) -> bool:
    """Пишет файл частями. False — файл оказался больше max_size, запись прервана."""

    size = 0

    with full_path.open("wb") as output:
        while chunk := await file.read(MEGABYTE):
            size += len(chunk)

            if size > max_size:
                return False

            await asyncio.to_thread(output.write, chunk)

    return True


def remove_file(path: str) -> None:
    """Удаляет файл поста. Путь вне папки публикаций — ValueError."""

    full_path = (UPLOADS_DIR / path).resolve()
    if not full_path.is_relative_to((UPLOADS_DIR / FOLDER).resolve()):
        raise ValueError("Файл должен находиться в папке публикаций")

    full_path.unlink(missing_ok=True)


def remove_files(paths: list[str]) -> None:
    """Удаляет файлы после того, как записи о них ушли из базы."""

    for path in paths:
        remove_file(path)
