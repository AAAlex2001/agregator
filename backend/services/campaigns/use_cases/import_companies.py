"Use case: потоковый импорт базы компаний из большой JSON-выгрузки (до сотен МБ) в таблицу companies."

import logging
from pathlib import Path
from typing import Any

import ijson

from database.database import AsyncSessionLocal
from services.campaigns.company_repository import CompanyRepository

logger = logging.getLogger(__name__)

CHUNK_SIZE = 2000  # upsert компаний пачками — память остаётся плоской на любом размере файла


def pick_primary_email(company: dict[str, Any]) -> str | None:
    "Первый валидный email компании, в нижнем регистре."
    for raw in company.get("emails") or []:
        candidate = str(raw or "").strip().lower()
        if candidate and "@" in candidate:
            return candidate
    return None


def to_company_row(company: dict[str, Any]) -> dict[str, Any] | None:
    "Преобразует запись компании из JSON в строку для таблицы companies. None — если нет ИНН (ключ дедупликации)."
    inn = str(company.get("inn") or "").strip()
    if not inn:
        return None
    return {
        "inn": inn[:12],
        "name": str(company.get("name") or "")[:500],
        "full_name": str(company.get("full_name") or "")[:1000],
        "kpp": (str(company.get("kpp"))[:20] if company.get("kpp") else None),
        "ogrn": (str(company.get("ogrn"))[:20] if company.get("ogrn") else None),
        "email": pick_primary_email(company),
        "region": (str(company.get("region"))[:200] if company.get("region") else None),
        "address": str(company.get("address")) if company.get("address") else None,
        "okved_code": (str(company.get("okved_code"))[:20] if company.get("okved_code") else None),
        "okved_name": (str(company.get("okved_name"))[:500] if company.get("okved_name") else None),
        "status": (str(company.get("status"))[:100] if company.get("status") else None),
    }


async def import_companies_from_file(json_path: Path) -> dict[str, int]:
    """Потоково читает JSON-массив компаний через ijson и upsert-ит в таблицу companies пачками.

    Запускается как фоновая задача со своей сессией БД. Память не зависит от размера файла.
    Дедупликация по ИНН — на уровне БД (ON CONFLICT). Возвращает статистику.
    """
    upserted = 0
    skipped_no_inn = 0
    buffer: list[dict[str, Any]] = []
    seen_inn: set[str] = set()

    async with AsyncSessionLocal() as db:
        repo = CompanyRepository(db)
        with json_path.open("rb") as fh:
            for company in ijson.items(fh, "item"):
                if not isinstance(company, dict):
                    continue
                row = to_company_row(company)
                if row is None:
                    skipped_no_inn += 1
                    continue
                # дедуп ИНН внутри файла, чтобы один upsert-чанк не содержал конфликта с самим собой
                if row["inn"] in seen_inn:
                    continue
                seen_inn.add(row["inn"])
                buffer.append(row)
                upserted += 1

                if len(buffer) >= CHUNK_SIZE:
                    await repo.bulk_upsert(buffer)
                    await db.commit()
                    buffer = []
                    seen_inn.clear()

        if buffer:
            await repo.bulk_upsert(buffer)
            await db.commit()

    logger.info("Companies import done: upserted=%d, skipped_no_inn=%d", upserted, skipped_no_inn)
    return {"upserted": upserted, "skipped_no_inn": skipped_no_inn}
