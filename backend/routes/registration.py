from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.registration import (
    EmailConfirmRequest,
    EmailConfirmResponse,
    LicenseHolderRegistration,
    PartySuggestionRequest,
    PartySuggestionResponse,
    UserRegistration,
    UserResponse,
)
from services.dadata import DaDataService
from services.license_storage import remove_license_file, save_license_file
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


def parse_license_holder_payload(payload: str = Form(...)) -> LicenseHolderRegistration:
    "Парсит JSON-строку формы в pydantic-модель; ошибки идут как стандартный 422."
    try:
        return LicenseHolderRegistration.model_validate_json(payload)
    except ValidationError as exc:
        raise RequestValidationError(exc.errors()) from exc


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


@router.post(
    "/license-holder",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_license_holder(
    background_tasks: BackgroundTasks,
    data: LicenseHolderRegistration = Depends(parse_license_holder_payload),
    license_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    file_url = await save_license_file(data.inn, license_file)
    try:
        service = RegistrationService(db)
        user = await service.create_license_holder(data, file_url)
    except Exception:
        remove_license_file(file_url)
        raise

    await service.schedule_email_confirmation(user, background_tasks)
    return user


@router.post("/party-suggestions", response_model=list[PartySuggestionResponse])
async def get_party_suggestions(payload: PartySuggestionRequest):
    service = DaDataService()
    return await service.suggest_parties(payload.query, payload.count)
