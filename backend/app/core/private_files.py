"""Закрытые файлы: backend/private_uploads/<папка>/<случайное имя>. Отдаёт их только API с проверкой прав."""

from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import UploadFile

from app.core.errors import AppError
from app.core.uploads import display_name, file_extension

PRIVATE_DIR = Path(__file__).resolve().parents[2] / "private_uploads"
CHUNK_SIZE = 1024 * 1024
MEGABYTE = 1024 * 1024


class PrivateFileError(AppError):
    """Файл не подходит: неверный формат или больше лимита."""

    status_code = 400


@dataclass(frozen=True)
class StoredFile:
    """Сохранённый файл: путь внутри хранилища, имя для скачивания и размер."""

    path: str
    name: str
    size: int


async def save_private(
    upload: UploadFile,
    folder: str,
    extensions: frozenset[str],
    max_size_mb: int,
) -> StoredFile:
    """Записать файл частями под случайным именем. Чужой формат или больше лимита — PrivateFileError."""

    extension = file_extension(upload)
    if extension not in extensions:
        allowed = ", ".join(sorted(item.removeprefix(".").upper() for item in extensions))
        raise PrivateFileError(f"Допустимые форматы: {allowed}")

    directory = PRIVATE_DIR / folder
    directory.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}{extension}"
    target = directory / stored_name
    max_size = max_size_mb * MEGABYTE
    size = 0

    async with aiofiles.open(target, "wb") as file:
        while chunk := await upload.read(CHUNK_SIZE):
            size += len(chunk)

            if size > max_size:
                break

            await file.write(chunk)

    if size > max_size:
        target.unlink()
        raise PrivateFileError(f"Файл больше {max_size_mb} МБ не поддерживается")

    return StoredFile(path=f"{folder}/{stored_name}", name=display_name(upload), size=size)


def write_private(content: bytes, folder: str, name: str) -> StoredFile:
    """Сохранить файл, который собрал сам сервер, например договор."""

    directory = PRIVATE_DIR / folder
    directory.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}{Path(name).suffix.lower()}"
    (directory / stored_name).write_bytes(content)

    return StoredFile(path=f"{folder}/{stored_name}", name=name, size=len(content))


def private_path(path: str) -> Path | None:
    """Файл на диске или None, если его нет или путь ведёт за пределы хранилища."""

    root = PRIVATE_DIR.resolve()
    target = (root / path).resolve()

    if not target.is_relative_to(root) or not target.is_file():
        return None

    return target


def remove_private(path: str) -> None:
    """Удалить файл. Уже удалённый файл не ошибка."""

    target = private_path(path)

    if target is not None:
        target.unlink(missing_ok=True)
