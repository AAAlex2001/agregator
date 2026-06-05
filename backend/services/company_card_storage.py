"Сохраняет PDF-карточку предприятия лицензиата под uploads/company-cards/<owner_key>/."
from fastapi import UploadFile

from services.file_uploads import remove_uploaded_file, save_uploaded_file

ALLOWED_EXTENSIONS = {".pdf"}
ALLOWED_CONTENT_TYPES = {"application/pdf"}
MAX_SIZE = 5 * 1024 * 1024


async def save_company_card(owner_key: str, file: UploadFile) -> str:
    "Публичный метод сервисного слоя."
    return await save_uploaded_file(
        subdir="company-cards",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message="Карточка предприятия принимается только в PDF",
        too_large_message="Карточка предприятия не должна превышать 5 МБ",
    )


def remove_company_card(file_url: str | None) -> None:
    "Удаляет ресурс."
    remove_uploaded_file(file_url)
