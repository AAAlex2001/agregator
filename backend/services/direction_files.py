"""Файлы анкет направлений: дипломы, аттестаты, свидетельства о курсах.

Общее хранилище для всех направлений: uploads/direction-documents/<public_id>/.
"""
from pathlib import PurePosixPath

from fastapi import UploadFile

from services.file_uploads import remove_uploaded_file, save_uploaded_file
from utils.filenames import sanitize_filename

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_SIZE = 10 * 1024 * 1024
MAX_PROFILE_DOCUMENTS = 10

BAD_FORMAT_MESSAGE = "Допустимые форматы: PDF, JPG, PNG, DOC, DOCX"
TOO_LARGE_MESSAGE = "Размер файла не должен превышать 10 МБ"


async def save_direction_file(owner_key: str, file: UploadFile) -> dict[str, str]:
    """Сохраняет файл анкеты и возвращает имя со ссылкой для JSONB-колонки."""
    original_name = file.filename or ""
    url = await save_uploaded_file(
        subdir="direction-documents",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message=BAD_FORMAT_MESSAGE,
        too_large_message=TOO_LARGE_MESSAGE,
    )
    name = sanitize_filename(original_name, fallback=PurePosixPath(url).name)
    return {"name": name, "url": url}


def owns_direction_file(owner_key: str, file_url: str | None) -> bool:
    """Лежит ли файл в каталоге документов этого аккаунта."""
    return bool(file_url) and file_url.startswith(f"/uploads/direction-documents/{owner_key}/")


def remove_direction_file(owner_key: str, file_url: str | None) -> None:
    """Удаляет файл анкеты с диска.

    Путь сверяется с каталогом владельца: ссылка могла прийти из подделанного запроса,
    а общий помощник удаления защищает только от выхода за пределы uploads.
    """
    if not owns_direction_file(owner_key, file_url):
        return
    remove_uploaded_file(file_url)
