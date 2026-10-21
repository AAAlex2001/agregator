"""Аудиторы в админке: кто руководит группами и получает заявки на аудит."""

from fastapi import APIRouter, Depends

from app.blitz.audit.dependencies import get_set_lead_usecase
from app.blitz.audit.schemas import LeadSchema
from app.blitz.audit.services.auditors import describe
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.audit.services.usecases.set_lead import SetAuditLeadUseCase
from app.blitz.orders.dependencies import get_audit_repository
from app.blitz.orders.schemas import TeamMemberSchema

router = APIRouter(tags=["admin-blitz"])


@router.get("/auditors")
async def list_auditors(audits: AuditRepository = Depends(get_audit_repository)) -> list[TeamMemberSchema]:
    """Эксперты с анкетой аудитора и признак руководителя группы."""

    leads = await audits.lead_ids()

    return [describe(account, account.id in leads) for account in await audits.list_auditors()]


@router.put("/auditors/{account_id}/lead")
async def set_lead(
    account_id: int,
    data: LeadSchema,
    usecase: SetAuditLeadUseCase = Depends(get_set_lead_usecase),
) -> TeamMemberSchema:
    """Назначить руководителем группы или снять с этой роли."""

    auditor = await usecase.execute(account_id, data.lead)

    return describe(auditor, data.lead)
