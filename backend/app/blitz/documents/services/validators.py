"""Проверки загружаемых файлов заявки."""

from fastapi import UploadFile

from app.blitz.orders.services.exceptions import InvalidOrderError

MAX_FILES = 20


def chosen_files(files: list[UploadFile]) -> list[UploadFile]:
    """Выбранные файлы без пустых полей формы. Больше 20 — InvalidOrderError."""

    uploads = [file for file in files if file.filename]

    if len(uploads) > MAX_FILES:
        raise InvalidOrderError(f"Можно приложить не больше {MAX_FILES} файлов за раз", "files")

    return uploads


def required_files(files: list[UploadFile], message: str) -> list[UploadFile]:
    """Хотя бы один файл. Нет ни одного — InvalidOrderError с текстом message."""

    uploads = chosen_files(files)

    if not uploads:
        raise InvalidOrderError(message, "files")

    return uploads
