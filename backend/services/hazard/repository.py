"Repository: доступ к БД для справочника факторов, кастомных каталогов и истории отчётов."
from dataclasses import dataclass
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.hazard import HazardFactor, HazardReport, HazardUserCatalog


@dataclass
class ResolvedFactor:
    "Фактор, разрешённый для эксперта: кастомный либо дефолтный, единый интерфейс."
    code: str
    group_code: str
    name: str
    max_score: float
    default_value: float | None
    options: list[Any]


class HazardRepository:
    "SQL-операции по факторам, кастомным каталогам экспертов и истории отчётов."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_factors(self, profile: str) -> list[HazardFactor]:
        "Дефолтный справочник факторов профиля в порядке отображения."
        query = (
            select(HazardFactor)
            .where(HazardFactor.profile == profile)
            .order_by(HazardFactor.sort_order)
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_user_catalog(self, expert_id: int, profile: str) -> HazardUserCatalog | None:
        "Кастомный каталог эксперта для профиля, если он его сохранял."
        query = select(HazardUserCatalog).where(
            HazardUserCatalog.expert_id == expert_id,
            HazardUserCatalog.profile == profile,
        )
        return (await self.db.execute(query)).scalars().first()

    async def resolve_factors(self, expert_id: int, profile: str) -> list[ResolvedFactor]:
        "Кастомный набор эксперта, иначе дефолтный справочник."
        user = await self.get_user_catalog(expert_id, profile)
        if user and user.factors:
            return [
                ResolvedFactor(
                    code=factor["code"],
                    group_code=factor["group_code"],
                    name=factor["name"],
                    max_score=float(factor.get("max_score") or 0.0),
                    default_value=factor.get("default_value"),
                    options=factor.get("options") or [],
                )
                for factor in user.factors
            ]
        return [
            ResolvedFactor(row.code, row.group_code, row.name, row.max_score, row.default_value, row.options)
            for row in await self.list_factors(profile)
        ]

    async def is_customized(self, expert_id: int, profile: str) -> bool:
        "Есть ли у эксперта сохранённый кастомный каталог для профиля."
        return await self.get_user_catalog(expert_id, profile) is not None

    async def save_user_catalog(self, expert_id: int, profile: str, factors: list[dict]) -> None:
        "Сохраняет (создаёт/обновляет) кастомный каталог эксперта."
        existing = await self.get_user_catalog(expert_id, profile)
        if existing is not None:
            existing.factors = factors
        else:
            self.db.add(HazardUserCatalog(expert_id=expert_id, profile=profile, factors=factors))
        await self.db.flush()

    async def reset_user_catalog(self, expert_id: int, profile: str) -> None:
        "Удаляет кастомный каталог эксперта — расчёт вернётся к дефолтному справочнику."
        await self.db.execute(
            delete(HazardUserCatalog).where(
                HazardUserCatalog.expert_id == expert_id,
                HazardUserCatalog.profile == profile,
            )
        )

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
