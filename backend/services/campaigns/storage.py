"Пути к файлам рассылки в общем томе uploads (его делят backend и admin-контейнеры)."

from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
UPLOADS_ROOT = BACKEND_ROOT / "uploads"

# Сюда admin-контейнер кладёт загруженную JSON-базу и PDF-презентацию.
# Общий том backend_uploads → backend читает те же файлы по тем же путям.
# Файлы фиксированы: одна актуальная база и одна актуальная презентация (перезаписываются при загрузке).
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"
COMPANIES_JSON = CAMPAIGN_IMPORTS_DIR / "companies.json"
PRESENTATION_PDF = CAMPAIGN_IMPORTS_DIR / "presentation.pdf"


def companies_json_path() -> Path:
    "Путь к загруженной JSON-базе компаний."
    return COMPANIES_JSON


def presentation_path() -> Path:
    "Путь к загруженной PDF-презентации."
    return PRESENTATION_PDF
