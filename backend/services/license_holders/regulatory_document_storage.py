"Хранилище дополнительных разрешительных документов лицензиата (лицензия маркшейдерских работ, выписка СРО, аккредитация лаборатории)."

from fastapi import UploadFile

from services.file_uploads import remove_uploaded_file, save_uploaded_file

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_SIZE = 10 * 1024 * 1024  # 10 МБ — у документов бывают сканы крупнее обычной лицензии


async def save_mining_license_file(owner_key: str, file: UploadFile) -> str:
    "Сохраняет файл лицензии на маркшейдерские работы под uploads/mining_licenses/<owner_key>/."
    return await save_uploaded_file(
        subdir="mining_licenses",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message="Допустимые форматы: PDF, JPG, PNG, DOC, DOCX",
        too_large_message="Размер файла не должен превышать 10 МБ",
    )


async def save_sro_design_file(owner_key: str, file: UploadFile) -> str:
    "Сохраняет выписку из реестра СРО проектирования под uploads/sro_design/<owner_key>/."
    return await save_uploaded_file(
        subdir="sro_design",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message="Допустимые форматы: PDF, JPG, PNG, DOC, DOCX",
        too_large_message="Размер файла не должен превышать 10 МБ",
    )


async def save_lab_accreditation_file(owner_key: str, file: UploadFile) -> str:
    "Сохраняет свидетельство об аккредитации лаборатории под uploads/lab_accreditations/<owner_key>/."
    return await save_uploaded_file(
        subdir="lab_accreditations",
        owner_key=owner_key,
        file=file,
        allowed_extensions=ALLOWED_EXTENSIONS,
        allowed_content_types=ALLOWED_CONTENT_TYPES,
        max_size=MAX_SIZE,
        bad_format_message="Допустимые форматы: PDF, JPG, PNG, DOC, DOCX",
        too_large_message="Размер файла не должен превышать 10 МБ",
    )


def remove_regulatory_document_file(file_url: str | None) -> None:
    "Удаляет файл регуляторного документа с диска. Для всех 3 типов используется один помощник — путь уже зашит в URL."
    remove_uploaded_file(file_url)
