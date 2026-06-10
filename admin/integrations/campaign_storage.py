"Сохранение загруженных файлов кампании в общий том uploads (его делят admin и backend-контейнеры)."

import secrets
from pathlib import Path

UPLOADS_ROOT = Path("/app/uploads")
CAMPAIGN_IMPORTS_DIR = UPLOADS_ROOT / "campaign_imports"


def new_token() -> str:
    "Случайный токен для пары файлов кампании (JSON + PDF)."
    return secrets.token_hex(16)


def save_import_files(token: str, json_bytes: bytes, pdf_bytes: bytes | None) -> bool:
    "Кладёт JSON-базу и (опц.) PDF в общий том под токеном. Возвращает True если PDF был сохранён."
    CAMPAIGN_IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
    (CAMPAIGN_IMPORTS_DIR / f"{token}.json").write_bytes(json_bytes)
    if pdf_bytes:
        (CAMPAIGN_IMPORTS_DIR / f"{token}.pdf").write_bytes(pdf_bytes)
        return True
    return False
