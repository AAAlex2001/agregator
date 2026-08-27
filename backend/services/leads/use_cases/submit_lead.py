"Use case: приём заявки с публичной страницы сайта."
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status

from models.lead import Lead
from schemas.lead import LeadCreate
from services.leads.repository import LeadRepository

DUPLICATE_WINDOW_MINUTES = 5
DUPLICATE_LIMIT = 3


class SubmitLeadUseCase:
    "Сохраняет заявку посетителя и защищает от повторных отправок с одного номера."

    def __init__(self, repo: LeadRepository) -> None:
        self.repo = repo

    async def execute(self, data: LeadCreate) -> Lead:
        "Запускает основной сценарий use case."
        phone = data.phone.strip()
        since = datetime.now(UTC) - timedelta(minutes=DUPLICATE_WINDOW_MINUTES)
        if await self.repo.count_recent_by_phone(phone, since) >= DUPLICATE_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Заявка уже отправлена, мы скоро свяжемся с вами",
            )

        lead = Lead(
            direction=data.direction,
            name=data.name.strip(),
            phone=phone,
            email=data.email.strip(),
            company=data.company.strip(),
            inn=data.inn.strip(),
            region=data.region.strip(),
            work_kinds=data.work_kinds.strip(),
            object_name=data.object_name.strip(),
            task=data.task.strip(),
            deadline=data.deadline.strip(),
            budget=data.budget.strip(),
            source_url=data.source_url.strip(),
        )
        return await self.repo.add(lead)
