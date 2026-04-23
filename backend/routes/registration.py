from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.registration import (
    EmailConfirmRequest,
    EmailConfirmResponse,
    PartySuggestionRequest,
    PartySuggestionResponse,
    UserRegistration,
    UserResponse,
)
from services.dadata import DaDataService
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    data: UserRegistration,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    user = await service.create_user(data)
    await service.schedule_email_confirmation(user, background_tasks)
    return user


@router.post("/confirm-email", response_model=EmailConfirmResponse)
async def confirm_email(
    data: EmailConfirmRequest,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    await service.confirm_email(data.email, data.code)
    return EmailConfirmResponse(message="Email подтверждён")


@router.post("/party-suggestions", response_model=list[PartySuggestionResponse])
async def get_party_suggestions(payload: PartySuggestionRequest):
    service = DaDataService()
    return await service.suggest_parties(payload.query, payload.count)
