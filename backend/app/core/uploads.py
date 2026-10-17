"""Файлы пользователей на диске: backend/uploads/<папка>/<случайное имя>."""

import re
import unicodedata
from pathlib import Path, PurePosixPath
from uuid import uuid4

import aiofiles
from fastapi import UploadFile

from app.core.errors import AppError

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"
CHUNK_SIZE = 1024 * 1024
MAX_NAME_LENGTH = 200
UNSAFE_NAME_CHARS = re.compile(r'[\x00-\x1f\x7f<>"]')


class FileTooLargeError(AppError):
    """Файл больше допустимого размера."""

    status_code = 400


def file_extension(upload: UploadFile) -> str:
    """Расширение в нижнем регистре: .pdf, .png или пустая строка."""

    return PurePosixPath(upload.filename or "").suffix.lower()


def display_name(upload: UploadFile) -> str:
    """Имя файла для показа: без пути и служебных символов, не длиннее 200 знаков."""

    raw_name = (upload.filename or "").replace("\\", "/")
    name = UNSAFE_NAME_CHARS.sub("", PurePosixPath(raw_name).name).strip()
    path = PurePosixPath(unicodedata.normalize("NFC", name))

    if not path.stem:
        return "file"

    return path.stem[: MAX_NAME_LENGTH - len(path.suffix)] + path.suffix


async def save_upload(upload: UploadFile, folder: str, max_size_mb: int) -> str:
    """Записать файл частями под случайным именем и вернуть его адрес. Больше лимита — FileTooLargeError."""

    directory = UPLOADS_DIR / folder
    stored_name = f"{uuid4().hex}{file_extension(upload)}"
    path = directory / stored_name
    max_size = max_size_mb * 1024 * 1024
    size = 0

    directory.mkdir(parents=True, exist_ok=True)

    async with aiofiles.open(path, "wb") as file:
        while chunk := await upload.read(CHUNK_SIZE):
            size += len(chunk)

            if size > max_size:
                break

            await file.write(chunk)

    if size > max_size:
        path.unlink()
        raise FileTooLargeError(f"Файл больше {max_size_mb} МБ не поддерживается")

    return f"/uploads/{folder}/{stored_name}"


def remove_upload(url: str) -> None:
    """Удалить файл по адресу /uploads/…; адрес за пределами папки загрузок не трогается."""

    path = (UPLOADS_DIR / url.removeprefix("/uploads/")).resolve()

    if path.is_relative_to(UPLOADS_DIR.resolve()):
        path.unlink(missing_ok=True)
