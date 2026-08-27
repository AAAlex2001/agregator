"Repository: доступ к БД для заявок с публичных страниц."
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.lead import Lead, LeadStatus


class LeadRepository:
    "Все обращения к БД по сущности Lead. Никакой бизнес-логики — только данные."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, lead: Lead) -> Lead:
        "Сохраняет заявку и возвращает её с присвоенным id."
        self.db.add(lead)
        await self.db.flush()
        await self.db.refresh(lead)
        return lead

    async def get_by_id(self, lead_id: int) -> Lead | None:
        "Возвращает заявку по идентификатору."
        result = await self.db.execute(select(Lead).where(Lead.id == lead_id))
        return result.scalars().first()

    async def list_all(
        self,
        status: LeadStatus | None,
        direction: str | None,
        skip: int,
        limit: int,
    ) -> tuple[list[Lead], int]:
        "Список заявок для админки: новые сверху, с общим количеством."
        query = select(Lead)
        if status is not None:
            query = query.where(Lead.status == status)
        if direction:
            query = query.where(Lead.direction == direction)

        total = await self.db.scalar(select(func.count()).select_from(query.subquery())) or 0
        rows = await self.db.execute(query.order_by(Lead.created_at.desc()).offset(skip).limit(limit))
        return list(rows.scalars().all()), total

    async def count_recent_by_phone(self, phone: str, since) -> int:
        "Сколько заявок с этого телефона пришло за период — защита от спама."
        return await self.db.scalar(
            select(func.count())
            .select_from(Lead)
            .where(Lead.phone == phone, Lead.created_at >= since)
        ) or 0

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()
