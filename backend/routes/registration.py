from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.rate_limit import rate_limit
from schemas.registration import (
    EmailConfirmRequest,
    LicenseHolderRegistration,
    PartySuggestionRequest,
    PartySuggestionResponse,
    ResendCodeRequest,
    UserRegistration,
    UserResponse,
)
from services.dadata import DaDataService
from services.license_holders import remove_license_file, save_license_file
from services.login import CreateSessionUseCase, LoginRepository, SESSION_MAX_DAYS
from services.registration import (
    ConfirmEmailUseCase,
    RegisterLicenseHolderUseCase,
    RegisterUserUseCase,
    RegistrationNotifier,
    RegistrationRepository,
    RegistrationValidator,
    ResendConfirmationUseCase,
)
from services.verification import VerificationService


router = APIRouter(prefix="/register", tags=["auth"])


def parse_license_holder_payload(payload: str = Form(...)) -> LicenseHolderRegistration:
    "Парсит JSON-строку формы в pydantic-модель; ошибки идут как стандартный 422."
    try:
        return LicenseHolderRegistration.model_validate_json(payload)
    except ValidationError as exc:
        raise RequestValidationError(exc.errors()) from exc


def build_repo(db: AsyncSession) -> RegistrationRepository:
    return RegistrationRepository(db)


def build_validator(repo: RegistrationRepository) -> RegistrationValidator:
    return RegistrationValidator(repo)


def build_notifier(db: AsyncSession) -> RegistrationNotifier:
    return RegistrationNotifier(VerificationService(db))


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("register", max_calls=3, window_seconds=60))],
)
async def register_user(
    data: UserRegistration,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    repo = build_repo(db)
    user = await RegisterUserUseCase(repo, build_validator(repo)).execute(data)
    await build_notifier(db).schedule_confirmation_email(user, background_tasks)
    return user


@router.post(
    "/confirm-email",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit("confirm_email", max_calls=5, window_seconds=60))],
)
async def confirm_email(
    data: EmailConfirmRequest,
    db: AsyncSession = Depends(get_db),
):
    "Подтверждает email и сразу выдаёт сессию — пользователь после ввода кода попадает в кабинет."
    user = await ConfirmEmailUseCase(build_repo(db), VerificationService(db)).execute(
        data.email, data.code, data.role
    )
    session = await CreateSessionUseCase(LoginRepository(db)).execute(user.id)

    response = JSONResponse(content=UserResponse.model_validate(user).model_dump(mode="json"))
    cookie_max_age = 60 * 60 * 24 * SESSION_MAX_DAYS
    response.set_cookie(
        key="session_id",
        value=session.session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=cookie_max_age,
        path="/",
    )
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        max_age=cookie_max_age,
        path="/",
    )
    return response


@router.post(
    "/resend-code",
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(rate_limit("resend_code", max_calls=2, window_seconds=60))],
)
async def resend_confirmation_code(
    data: ResendCodeRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    "Повторно отправляет код подтверждения почты — для случая, когда пользователь закрыл вкладку."
    await ResendConfirmationUseCase(build_repo(db), build_notifier(db)).execute(
        data.email, background_tasks, data.role
    )
    return {"detail": "Код отправлен повторно"}


@router.post(
    "/license-holder",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("register_lh", max_calls=3, window_seconds=60))],
)
async def register_license_holder(
    background_tasks: BackgroundTasks,
    data: LicenseHolderRegistration = Depends(parse_license_holder_payload),
    license_file: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
):
    file_url = await save_license_file(data.inn, license_file) if license_file else None
    repo = build_repo(db)
    try:
        user = await RegisterLicenseHolderUseCase(repo, build_validator(repo)).execute(
            data, file_url
        )
    except Exception:
        remove_license_file(file_url)
        raise

    await build_notifier(db).schedule_confirmation_email(user, background_tasks)
    return user


@router.post("/party-suggestions", response_model=list[PartySuggestionResponse])
async def get_party_suggestions(payload: PartySuggestionRequest):
    service = DaDataService()
    return await service.suggest_parties(payload.query, payload.count)
