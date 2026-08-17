"""HTTP-зависимости для разбора multipart-запросов регистрации."""

from fastapi import Depends, Form, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.registration import LicenseHolderRegistration, UserRegistration
from services.login import LoginRepository
from services.registration import RegistrationNotifier, RegistrationRepository, RegistrationValidator
from services.registration.validation_errors import registration_validation_message
from services.verification import VerificationService


def get_registration_repository(db: AsyncSession = Depends(get_db)) -> RegistrationRepository:
    return RegistrationRepository(db)


def get_registration_validator(
    repository: RegistrationRepository = Depends(get_registration_repository),
) -> RegistrationValidator:
    return RegistrationValidator(repository)


def get_registration_notifier(db: AsyncSession = Depends(get_db)) -> RegistrationNotifier:
    return RegistrationNotifier(VerificationService(db))


def get_verification_service(db: AsyncSession = Depends(get_db)) -> VerificationService:
    return VerificationService(db)


def get_login_repository(db: AsyncSession = Depends(get_db)) -> LoginRepository:
    return LoginRepository(db)


def parse_user_payload(payload: str | None = Form(None)) -> UserRegistration:
    if not payload:
        raise HTTPException(
            status_code=422,
            detail="Данные регистрации не переданы",
        )
    try:
        return UserRegistration.model_validate_json(payload)
    except ValidationError as exc:
        raise HTTPException(
            status_code=422,
            detail=registration_validation_message(exc),
        ) from exc


def parse_license_holder_payload(payload: str | None = Form(None)) -> LicenseHolderRegistration:
    if not payload:
        raise HTTPException(
            status_code=422,
            detail="Данные регистрации не переданы",
        )
    try:
        return LicenseHolderRegistration.model_validate_json(payload)
    except ValidationError as exc:
        raise HTTPException(
            status_code=422,
            detail=registration_validation_message(exc),
        ) from exc
