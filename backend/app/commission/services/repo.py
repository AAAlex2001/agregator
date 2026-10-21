"""Запросы к заявкам в комиссию. Коммит делает сессия запроса."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.commission.models import ApplicationStatus, CommissionApplication


class CommissionRepository:
    """Доступ к таблице commission_applications."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, application_id: int) -> CommissionApplication | None:
        """Заявка по id или None."""

        return await self.db.get(CommissionApplication, application_id)

    async def page(
        self,
        status: ApplicationStatus | None,
        limit: int,
        offset: int,
    ) -> tuple[list[CommissionApplication], int]:
        """Заявки, новые первыми, и сколько их всего. Без статуса — все."""

        stmt = select(CommissionApplication)
        if status is not None:
            stmt = stmt.where(CommissionApplication.status == status)

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        ordered = stmt.order_by(CommissionApplication.created_at.desc(), CommissionApplication.id.desc())
        items = await self.db.scalars(ordered.limit(limit).offset(offset))

        return list(items), total or 0

    async def add(self, application: CommissionApplication) -> None:
        """Записать новую заявку."""

        self.db.add(application)
        await self.db.flush()

    async def save(self) -> None:
        """Записать изменения."""

        await self.db.flush()

    async def delete(self, application: CommissionApplication) -> None:
        """Удалить заявку."""

        await self.db.delete(application)
        await self.db.flush()
