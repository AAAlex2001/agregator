"Repository: доступ к БД для базы компаний (таблица companies) и трекинга отправки рассылки."

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import func, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.company import Company
from models.email_suppression import EmailSuppression

ACTIVE_STATUS = "Действующее"
SUPPRESSED_EMAILS = select(EmailSuppression.email)


class CompanyRepository:
    "Обращения к БД по базе компаний: upsert при импорте, счётчики, выборка непосланных, отметка отправки."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def bulk_upsert(self, rows: list[dict[str, Any]]) -> None:
        "Массовая вставка компаний с обновлением по ИНН (ON CONFLICT). sent_at не трогаем — историю отправки сохраняем."
        if not rows:
            return
        stmt = pg_insert(Company).values(rows)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Company.inn],
            set_={
                "name": stmt.excluded.name,
                "full_name": stmt.excluded.full_name,
                "kpp": stmt.excluded.kpp,
                "ogrn": stmt.excluded.ogrn,
                "email": stmt.excluded.email,
                "region": stmt.excluded.region,
                "address": stmt.excluded.address,
                "okved_code": stmt.excluded.okved_code,
                "okved_name": stmt.excluded.okved_name,
                "status": stmt.excluded.status,
                "updated_at": func.now(),
            },
        )
        await self.db.execute(stmt)

    async def total_count(self) -> int:
        "Всего компаний в базе."
        return int((await self.db.execute(select(func.count()).select_from(Company))).scalar_one() or 0)

    async def sendable_count(self) -> int:
        "Сколько компаний пригодны для рассылки: действующие, с email."
        stmt = select(func.count()).select_from(Company).where(
            Company.status == ACTIVE_STATUS, Company.email.isnot(None)
        )
        return int((await self.db.execute(stmt)).scalar_one() or 0)

    async def sent_count(self) -> int:
        "Сколько компаний уже получили письмо."
        stmt = select(func.count()).select_from(Company).where(Company.sent_at.isnot(None))
        return int((await self.db.execute(stmt)).scalar_one() or 0)

    async def sent_today_count(self) -> int:
        "Сколько писем кампании отправлено сегодня — для дневного лимита прогрева."
        stmt = select(func.count()).select_from(Company).where(
            Company.sent_at >= func.date_trunc("day", func.now())
        )
        return int((await self.db.execute(stmt)).scalar_one() or 0)

    async def remaining_count(self) -> int:
        "Сколько действующих компаний с email ещё не получили письмо."
        stmt = select(func.count()).select_from(Company).where(
            Company.status == ACTIVE_STATUS, Company.email.isnot(None), Company.sent_at.is_(None)
        )
        return int((await self.db.execute(stmt)).scalar_one() or 0)

    async def take_unsent_batch(self, limit: int) -> list[Company]:
        "Берёт пачку компаний, которым ещё не слали (действующие, с email), по порядку id."
        stmt = (
            select(Company)
            .where(
                Company.status == ACTIVE_STATUS,
                Company.email.isnot(None),
                Company.sent_at.is_(None),
                func.lower(Company.email).notin_(SUPPRESSED_EMAILS),
            )
            .order_by(Company.id)
            .limit(limit)
        )
        return list((await self.db.execute(stmt)).scalars().all())

    async def take_range(self, start: int, end: int) -> list[Company]:
        "Берёт компании по позиции в базе (1-based, включительно): пригодные к рассылке, по порядку id, позиции start..end."
        start = max(1, start)
        if end < start:
            return []
        stmt = (
            select(Company)
            .where(
                Company.status == ACTIVE_STATUS,
                Company.email.isnot(None),
                func.lower(Company.email).notin_(SUPPRESSED_EMAILS),
            )
            .order_by(Company.id)
            .offset(start - 1)
            .limit(end - start + 1)
        )
        return list((await self.db.execute(stmt)).scalars().all())

    async def mark_sent(self, company_ids: list[int]) -> None:
        "Проставляет время отправки компаниям. Коммит — на стороне use case."
        if not company_ids:
            return
        now = datetime.now(UTC)
        chunk = 2000
        for i in range(0, len(company_ids), chunk):
            ids = company_ids[i:i + chunk]
            await self.db.execute(update(Company).where(Company.id.in_(ids)).values(sent_at=now))
