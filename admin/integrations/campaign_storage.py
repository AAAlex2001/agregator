"Сохранение загруженных файлов рассылки в общий том uploads (его делят admin и backend-контейнеры)."

from pathlib import Path

UPLOADS_ROOT = Path("/app/uploads")
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"
# Файлы фиксированы: одна актуальная база и одна актуальная презентация (перезаписываются при загрузке).
COMPANIES_JSON = CAMPAIGN_IMPORTS_DIR / "companies.json"
PRESENTATION_PDF = CAMPAIGN_IMPORTS_DIR / "presentation.pdf"


def save_companies_json(json_bytes: bytes) -> None:
    "Перезаписывает JSON-базу компаний в общем томе. Бэк прочитает её потоково."
    CAMPAIGN_IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
    COMPANIES_JSON.write_bytes(json_bytes)


def save_presentation(pdf_bytes: bytes) -> None:
    "Перезаписывает PDF-презентацию в общем томе. Бэк прикрепит её к письмам."
    CAMPAIGN_IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
    PRESENTATION_PDF.write_bytes(pdf_bytes)
