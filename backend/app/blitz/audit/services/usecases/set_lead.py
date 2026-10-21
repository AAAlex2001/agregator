"""Администратор назначает аудитора руководителем группы или снимает с этой роли."""

from app.blitz.audit.services.exceptions import NotAuditorError
from app.blitz.audit.services.repo import AuditRepository
from models.account import Account


class SetAuditLeadUseCase:
    """Руководители групп получают новые заявки на аудит и набирают группы."""

    def __init__(self, audits: AuditRepository) -> None:
        self.audits = audits

    async def execute(self, account_id: int, lead: bool) -> Account:
        """Не аудитор — NotAuditorError."""

        auditor = await self.audits.get_auditor(account_id)
        if auditor is None:
            raise NotAuditorError

        await self.audits.set_lead(account_id, lead)

        return auditor
