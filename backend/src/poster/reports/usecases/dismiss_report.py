from src.poster.reports.exceptions import ReportNotFoundError
from src.poster.reports.models import ReportStatus
from src.poster.reports.repository import ReportRepository


class DismissReportUseCase:
    """Модератор отклоняет жалобу: нарушения нет."""

    def __init__(self, reports: ReportRepository) -> None:
        """Принимает репозиторий жалоб."""
        self.reports = reports

    async def execute(self, *, report_id: int) -> None:
        """Отмечает жалобу рассмотренной, ничего не меняя в посте или комментарии."""
        report = await self.reports.get(report_id)

        if report is None:
            raise ReportNotFoundError()

        report.status = ReportStatus.RESOLVED
        await self.reports.save()
