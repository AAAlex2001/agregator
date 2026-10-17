"""Проверки вложений и ответов в обращении."""

from fastapi import UploadFile

from app.core.uploads import file_extension
from app.support.services.exceptions import AttachmentError, EmptyReplyError

MAX_FILES = 6
ALLOWED_EXTENSIONS = {".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx"}


def validate_uploads(files: list[UploadFile]) -> list[UploadFile]:
    """Выбранные файлы без пустых полей формы. Лишние или чужого формата — AttachmentError."""

    uploads = [file for file in files if file.filename]

    if len(uploads) > MAX_FILES:
        raise AttachmentError(f"Можно прикрепить не больше {MAX_FILES} файлов")

    for upload in uploads:
        if file_extension(upload) not in ALLOWED_EXTENSIONS:
            raise AttachmentError("Допустимые форматы: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX")

    return uploads


def validate_reply(text: str, uploads: list[UploadFile]) -> str:
    """Текст ответа без пробелов по краям. Ни текста, ни файлов — EmptyReplyError."""

    text = text.strip()

    if not text and not uploads:
        raise EmptyReplyError

    return text
