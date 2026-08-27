"Use cases: просмотр и обработка заявок в админке."
from fastapi import HTTPException, status

from models.lead import Lead, LeadStatus
from services.leads.repository import LeadRepository


class ListLeadsUseCase:
    "Отдаёт заявки с фильтрами по статусу и направлению."

    def __init__(self, repo: LeadRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        status_filter: LeadStatus | None,
        direction: str | None,
        skip: int,
        limit: int,
    ) -> tuple[list[Lead], int]:
        "Запускает основной сценарий use case."
        return await self.repo.list_all(status_filter, direction, skip, limit)


class UpdateLeadUseCase:
    "Меняет статус заявки и заметку менеджера."

    def __init__(self, repo: LeadRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        lead_id: int,
        new_status: LeadStatus | None,
        comment: str | None,
    ) -> Lead:
        "Запускает основной сценарий use case."
        lead = await self.repo.get_by_id(lead_id)
        if lead is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")
        if new_status is not None:
            lead.status = new_status
        if comment is not None:
            lead.comment = comment.strip()
        await self.repo.flush()
        return lead
