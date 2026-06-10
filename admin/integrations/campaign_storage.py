"Файлы рассылки в общем томе uploads. JSON-база — внутренняя; презентация хостится публично (ссылка в письме)."

from pathlib import Path

PUBLIC_BASE = "https://plus-resurs.com"

UPLOADS_ROOT = Path("/app/uploads")

# Внутренняя JSON-база компаний (nginx закрывает /uploads/campaign_imports/ от публики).
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"
COMPANIES_JSON = CAMPAIGN_IMPORTS_DIR / "companies.json"

# Презентация — публичная (nginx отдаёт /uploads/presentations/), письмо ссылается ссылкой.
PRESENTATIONS_DIR = UPLOADS_ROOT / "presentations"
PRESENTATION_PDF = PRESENTATIONS_DIR / "presentation.pdf"


def save_companies_json(json_bytes: bytes) -> None:
    "Перезаписывает JSON-базу компаний в общем томе. Бэк прочитает её потоково."
    CAMPAIGN_IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
    COMPANIES_JSON.write_bytes(json_bytes)


def save_presentation(pdf_bytes: bytes) -> None:
    "Перезаписывает PDF-презентацию в публичной папке тома. Письмо даёт на неё ссылку."
    PRESENTATIONS_DIR.mkdir(parents=True, exist_ok=True)
    PRESENTATION_PDF.write_bytes(pdf_bytes)


def presentation_public_url() -> str | None:
    "Публичная ссылка на презентацию с cache-bust по mtime (None — если не загружена)."
    if not PRESENTATION_PDF.exists():
        return None
    version = int(PRESENTATION_PDF.stat().st_mtime)
    return f"{PUBLIC_BASE}/uploads/presentations/presentation.pdf?v={version}"
