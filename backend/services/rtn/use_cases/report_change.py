"Use case: кнопка «Сообщить об изменении» — фиксирует сигнал, что разъяснение устарело."

from fastapi import HTTPException, status

from models.rtn_change_report import RtnChangeReport
from services.rtn.repository import RtnChangeReportRepository, RtnRepository


class ReportRtnChangeUseCase:
    def __init__(self, clarifications: RtnRepository, reports: RtnChangeReportRepository) -> None:
        self.clarifications = clarifications
        self.reports = reports

    async def execute(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str,
        description: str,
    ) -> RtnChangeReport:
        clarification = await self.clarifications.get_published_by_id(clarification_id)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
        return await self.reports.add(clarification_id, user_id, visitor_key, description.strip())
