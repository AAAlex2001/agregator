"""Отклонение жалобы."""

from app.poster.reports.models import PostReport
from app.poster.reports.services.repo import PostReportRepository


class DismissReportUseCase:
    """Материал в порядке: закрываются все жалобы на тот же пост или комментарий."""

    def __init__(self, reports: PostReportRepository) -> None:
        self.reports = reports

    async def execute(self, report: PostReport) -> None:
        """Закрывает жалобы."""

        if report.comment_id is not None:
            await self.reports.resolve_comment(report.comment_id)

        if report.post_id is not None:
            await self.reports.resolve_post(report.post_id)
