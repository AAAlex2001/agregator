"Repository: доступ к БД для справочника факторов и сохранённых отчётов эксперта."
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.hazard import HazardFactor, HazardReport


class HazardRepository:
    "SQL-операции по факторам оценки опасности и истории отчётов эксперта."

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

    async def save_report(self, report: HazardReport) -> HazardReport:
        "Сохраняет отчёт эксперта в историю."
        self.db.add(report)
        await self.db.flush()
        return report

    async def list_reports(self, expert_id: int) -> list[HazardReport]:
        "История отчётов эксперта, новые сверху."
        query = (
            select(HazardReport)
            .where(HazardReport.expert_id == expert_id)
            .order_by(HazardReport.created_at.desc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_report(self, report_id: int, expert_id: int) -> HazardReport | None:
        "Отчёт эксперта по id (только свой)."
        query = select(HazardReport).where(
            HazardReport.id == report_id,
            HazardReport.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()
