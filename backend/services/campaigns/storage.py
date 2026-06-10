"Пути к файлам кампаний в общем томе uploads (его делят backend и admin-контейнеры)."

from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
UPLOADS_ROOT = BACKEND_ROOT / "uploads"

# Сюда admin-контейнер кладёт загруженные JSON-базы и PDF-презентации.
# Общий том backend_uploads → backend читает те же файлы по тем же путям.
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"


def import_json_path(token: str) -> Path:
    "Путь к загруженной JSON-базе компаний по токену кампании."
    return CAMPAIGN_IMPORTS_DIR / f"{token}.json"


def presentation_path(token: str) -> Path:
    "Путь к загруженной PDF-презентации по токену кампании."
    return CAMPAIGN_IMPORTS_DIR / f"{token}.pdf"


def ensure_imports_dir() -> None:
    "Создаёт каталог для импорт-файлов, если его ещё нет."
    CAMPAIGN_IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
