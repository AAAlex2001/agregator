"""Жалобы: репозиторий и жалоба по id из пути."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.reports.models import PostReport
from app.poster.reports.services.exceptions import ReportNotFoundError
from app.poster.reports.services.repo import PostReportRepository


def get_report_repository(db: AsyncSession = Depends(get_db)) -> PostReportRepository:
    """Жалобы."""

    return PostReportRepository(db)


async def get_report(
    report_id: int,
    reports: PostReportRepository = Depends(get_report_repository),
) -> PostReport:
    """Жалоба для модератора. Нет — 404."""

    report = await reports.get_by_id(report_id)
    if report is None:
        raise ReportNotFoundError

    return report
