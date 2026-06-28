"Repository: доступ к БД для справочника факторов крепи и истории отчётов."
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.lining import LiningFactor, LiningReport


class LiningRepository:
    "SQL-операции по факторам риска и истории отчётов оценки крепи."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_factors(self, profile: str) -> list[LiningFactor]:
        "Справочник факторов профиля в порядке отображения."
        query = (
            select(LiningFactor)
            .where(LiningFactor.profile == profile)
            .order_by(LiningFactor.sort_order)
        )
        return list((await self.db.execute(query)).scalars().all())

    async def save_report(self, report: LiningReport) -> LiningReport:
        "Сохраняет отчёт эксперта в историю."
        self.db.add(report)
        await self.db.flush()
        return report

    async def list_reports(self, expert_id: int) -> list[LiningReport]:
        "История отчётов эксперта, новые сверху."
        query = (
            select(LiningReport)
            .where(LiningReport.expert_id == expert_id)
            .order_by(LiningReport.created_at.desc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_report(self, report_id: int, expert_id: int) -> LiningReport | None:
        "Отчёт эксперта по id (только свой)."
        query = select(LiningReport).where(
            LiningReport.id == report_id,
            LiningReport.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()
