from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.rate_limit import rate_limit
from schemas.common import OkResponse
from schemas.lead import LeadCreate
from services.leads import LeadRepository, SubmitLeadUseCase

router = APIRouter(prefix="/public/leads", tags=["leads"])


@router.post(
    "",
    response_model=OkResponse,
    dependencies=[Depends(rate_limit("lead_submit", max_calls=5, window_seconds=600))],
)
async def submit_lead(data: LeadCreate, db: AsyncSession = Depends(get_db)) -> OkResponse:
    "Принимает заявку посетителя с публичной страницы. Авторизация не требуется."
    await SubmitLeadUseCase(LeadRepository(db)).execute(data)
    return OkResponse()
