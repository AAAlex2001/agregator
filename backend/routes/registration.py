from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.registration import PartySuggestionRequest, PartySuggestionResponse, UserRegistration, UserResponse
from services.dadata import DaDataService
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


@router.post("/", response_model=UserResponse)
async def register_user(
    data: UserRegistration,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    user = await service.create_user(data)
    return user


@router.post("/party-suggestions", response_model=list[PartySuggestionResponse])
async def get_party_suggestions(payload: PartySuggestionRequest):
    service = DaDataService()
    return await service.suggest_parties(payload.query, payload.count)
