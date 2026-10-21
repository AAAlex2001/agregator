"""Комиссия меняет статус заявки и сообщает кандидату решение."""

from app.commission.models import ApplicationStatus, CommissionApplication
from app.commission.services.letters import CommissionLetters
from app.commission.services.repo import CommissionRepository
from app.core.clock import now


class ReviewApplicationUseCase:
    """Статус и комментарий. Кандидат получает письмо, когда статус меняется."""

    def __init__(self, applications: CommissionRepository, letters: CommissionLetters) -> None:
        self.applications = applications
        self.letters = letters

    async def execute(
        self,
        application: CommissionApplication,
        status: ApplicationStatus,
        decision: str | None,
    ) -> CommissionApplication:
        """Тот же статус только обновляет комментарий, без письма."""

        changed = status != application.status
        application.status = status
        application.decision = decision.strip() if decision else None
        application.reviewed_at = now()
        await self.applications.save()

        if changed:
            self.letters.decided(application)

        return application
