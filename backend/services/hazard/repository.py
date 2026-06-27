"Repository: доступ к БД для справочника факторов опасности."
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.hazard import HazardFactor


class HazardRepository:
    "SQL-операции по справочнику факторов оценки опасности аварий."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_factors(self, profile: str) -> list[HazardFactor]:
        "Все факторы профиля (rudnik/shahta) в порядке отображения."
        query = (
            select(HazardFactor)
            .where(HazardFactor.profile == profile)
            .order_by(HazardFactor.sort_order)
        )
        return list((await self.db.execute(query)).scalars().all())
