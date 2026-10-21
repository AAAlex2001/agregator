"""Запросы к тарифам. Коммит делает сессия запроса."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.pricing.models import Tariff


class TariffRepository:
    """Доступ к таблице blitz_tariffs."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Tariff]:
        """Все тарифы по порядку области и объекта."""

        stmt = select(Tariff).order_by(Tariff.area_code, Tariff.object_code)

        return list(await self.db.scalars(stmt))

    async def by_pair(self) -> dict[tuple[str, str], Tariff]:
        """Тарифы по паре кодов."""

        return {(item.area_code, item.object_code): item for item in await self.list_all()}

    def add(self, tariff: Tariff) -> None:
        """Новый тариф."""

        self.db.add(tariff)

    async def delete(self, tariff: Tariff) -> None:
        """Удалить тариф."""

        await self.db.delete(tariff)

    async def save(self) -> None:
        """Записать изменения."""

        await self.db.flush()
