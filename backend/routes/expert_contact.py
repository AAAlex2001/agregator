from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from routes.contact_deal import build_contact_cipher
from schemas.expert_contact import (
    ExpertContactListResponse,
    ExpertContactOfferResponse,
    ExpertContactOfferUpdate,
)
from services.expert_contacts import (
    ExpertContactRepository,
    GetExpertContactOfferUseCase,
    ListExpertContactsUseCase,
    UpdateExpertContactOfferUseCase,
)

router = APIRouter(prefix="/expert-contacts", tags=["expert-contacts"])


@router.get("", response_model=ExpertContactListResponse)
async def list_expert_contacts(
    search: str | None = Query(None, max_length=100),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertContactListResponse:
    return await ListExpertContactsUseCase(
        ExpertContactRepository(db), build_contact_cipher()
    ).execute(user_id, search, limit, offset)


@router.get("/offer", response_model=ExpertContactOfferResponse)
async def get_expert_contact_offer(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertContactOfferResponse:
    return await GetExpertContactOfferUseCase(
        ExpertContactRepository(db), build_contact_cipher()
    ).execute(user_id)


@router.put("/offer", response_model=ExpertContactOfferResponse)
async def update_expert_contact_offer(
    payload: ExpertContactOfferUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertContactOfferResponse:
    return await UpdateExpertContactOfferUseCase(
        ExpertContactRepository(db), build_contact_cipher()
    ).execute(user_id, payload)
