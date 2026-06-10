"Путь к JSON-базе компаний в общем томе uploads (его делят backend и admin-контейнеры)."

from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
UPLOADS_ROOT = BACKEND_ROOT / "uploads"

# Сюда admin-контейнер кладёт загруженную JSON-базу; backend читает её по тому же пути (общий том).
# Презентация хостится отдельно (admin кладёт в uploads/presentations/, письмо ссылается ссылкой) — backend её не трогает.
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"
COMPANIES_JSON = CAMPAIGN_IMPORTS_DIR / "companies.json"


def companies_json_path() -> Path:
    "Путь к загруженной JSON-базе компаний."
    return COMPANIES_JSON
