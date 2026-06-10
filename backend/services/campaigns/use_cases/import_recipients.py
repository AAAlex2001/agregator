"Use case: потоковый импорт получателей кампании из большой JSON-базы компаний (до сотен МБ)."

import logging
from pathlib import Path
from typing import Any

import ijson

from database.database import AsyncSessionLocal
from models.campaign import CampaignStatus
from services.campaigns.repository import CampaignRepository

logger = logging.getLogger(__name__)

ACTIVE_STATUS = "Действующее"
CHUNK_SIZE = 2000  # вставляем получателей пачками — память остаётся плоской на любом размере файла


def pick_primary_email(company: dict[str, Any]) -> str | None:
    "Берёт первый валидный email компании. Шлём только на один адрес, не на все сразу."
    emails = company.get("emails") or []
    for raw in emails:
        candidate = str(raw or "").strip().lower()
        if candidate and "@" in candidate:
            return candidate
    return None


async def import_recipients_from_file(
    campaign_id: int,
    json_path: Path,
    only_active: bool = True,
) -> dict[str, int]:
    """Потоково читает JSON-массив компаний через ijson и вставляет получателей пачками.

    Запускается как фоновая задача. Использует собственную сессию БД.
    Память не зависит от размера файла — парсим по одному объекту, держим только буфер чанка
    и set уже виденных email для дедупликации.
    """
    added = skipped_inactive = skipped_no_email = skipped_dup = skipped_suppressed = 0
    buffer: list[dict[str, object]] = []
    seen: set[str] = set()

    async with AsyncSessionLocal() as db:
        repo = CampaignRepository(db)
        suppressed = await repo.suppressed_emails()
        seen |= await repo.existing_emails(campaign_id)

        try:
            with json_path.open("rb") as fh:
                for company in ijson.items(fh, "item"):
                    if not isinstance(company, dict):
                        continue
                    if only_active and company.get("status") != ACTIVE_STATUS:
                        skipped_inactive += 1
                        continue
                    email = pick_primary_email(company)
                    if email is None:
                        skipped_no_email += 1
                        continue
                    if email in seen:
                        skipped_dup += 1
                        continue
                    if email in suppressed:
                        skipped_suppressed += 1
                        continue

                    seen.add(email)
                    buffer.append({
                        "campaign_id": campaign_id,
                        "company_name": str(company.get("name") or company.get("full_name") or "")[:500],
                        "inn": str(company.get("inn"))[:12] if company.get("inn") else None,
                        "email": email[:320],
                        "is_seed": False,
                    })
                    added += 1

                    if len(buffer) >= CHUNK_SIZE:
                        await repo.bulk_add_recipients(buffer)
                        await db.commit()
                        buffer = []

            if buffer:
                await repo.bulk_add_recipients(buffer)
                await db.commit()
        except Exception:
            logger.exception("Import failed for campaign %d, marking FAILED", campaign_id)
            await repo.set_status(campaign_id, CampaignStatus.FAILED)
            await db.commit()
            raise

    logger.info("Campaign %d import done: added=%d", campaign_id, added)
    return {
        "added": added,
        "skipped_inactive": skipped_inactive,
        "skipped_no_email": skipped_no_email,
        "skipped_duplicate": skipped_dup,
        "skipped_suppressed": skipped_suppressed,
    }
