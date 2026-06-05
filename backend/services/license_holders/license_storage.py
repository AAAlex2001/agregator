"Сохраняет файл лицензии (PDF/JPG/PNG) на диск под uploads/licenses/<owner_key>/."
from fastapi import UploadFile

from services.file_uploads import remove_uploaded_file, save_uploaded_file

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}
MAX_SIZE = 5 * 1024 * 1024


async def save_license_file(owner_key: str, file: UploadFile) -> str:
    "Публичный метод сервисного слоя."
    return await save_uploaded_file(
        subdir="licenses",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message="Допустимые форматы файла лицензии: PDF, JPG, PNG",
        too_large_message="Размер файла лицензии не должен превышать 5 МБ",
    )


def remove_license_file(file_url: str | None) -> None:
    "Удаляет ресурс."
    remove_uploaded_file(file_url)
