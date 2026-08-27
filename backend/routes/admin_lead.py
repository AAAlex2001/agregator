"Заявки с сайта для admin-next. За X-Internal-Token; логин держит сама админка."

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from models.lead import LeadStatus
from schemas.lead import LeadListOut, LeadOut, LeadUpdate
from services.leads import LeadRepository, ListLeadsUseCase, UpdateLeadUseCase

router = APIRouter(
    prefix="/internal/leads",
    tags=["admin-leads"],
    dependencies=[Depends(require_internal_token)],
)


def parse_status(raw: str | None) -> LeadStatus | None:
    "Преобразует query-параметр в статус заявки, при неверном значении отдаёт 422."
    if raw is None:
        return None
    try:
        return LeadStatus(raw)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Недопустимый статус: {raw}",
        )


@router.get("", response_model=LeadListOut)
async def list_leads(
    status_filter: str | None = Query(None, alias="status"),
    direction: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> LeadListOut:
    "Список заявок с сайта: новые сверху, с фильтрами по статусу и направлению."
    use_case = ListLeadsUseCase(LeadRepository(db))
    items, total = await use_case.execute(parse_status(status_filter), direction, skip, limit)
    return LeadListOut(items=[LeadOut.model_validate(item) for item in items], total=total)


@router.patch("/{lead_id}", response_model=LeadOut)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
) -> LeadOut:
    "Меняет статус заявки и заметку менеджера."
    use_case = UpdateLeadUseCase(LeadRepository(db))
    lead = await use_case.execute(lead_id, parse_status(data.status), data.comment)
    return LeadOut.model_validate(lead)
