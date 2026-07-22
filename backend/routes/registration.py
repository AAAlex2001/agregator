from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.contact_deal import build_contact_cipher
from dependencies.rate_limit import rate_limit
from schemas.common import DetailResponse
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
from services.license_holders import (
    remove_license_file,
    remove_regulatory_document_file,
    save_lab_accreditation_file,
    save_license_file,
    save_mining_license_file,
    save_sro_design_file,
)
from services.login import SESSION_COOKIE_MAX_AGE_SECONDS, CreateSessionUseCase, LoginRepository
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
) -> UserResponse:
    "Регистрирует обычного пользователя и отправляет письмо подтверждения почты."
    repo = build_repo(db)
    cipher = build_contact_cipher() if data.contact_sales_enabled else None
    user = await RegisterUserUseCase(repo, build_validator(repo), cipher).execute(data)
    await build_notifier(db).schedule_confirmation_email(user, background_tasks)
    return UserResponse.model_validate(user)


@router.post(
    "/confirm-email",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit("confirm_email", max_calls=5, window_seconds=60))],
)
async def confirm_email(
    data: EmailConfirmRequest,
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    "Подтверждает email и сразу выдаёт сессию — пользователь после ввода кода попадает в кабинет."
    user = await ConfirmEmailUseCase(build_repo(db), VerificationService(db)).execute(
        data.email, data.code, data.role
    )
    session = await CreateSessionUseCase(LoginRepository(db)).execute(user.id)

    response = JSONResponse(content=UserResponse.model_validate(user).model_dump(mode="json"))
    response.set_cookie(
        key="session_id",
        value=session.session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=SESSION_COOKIE_MAX_AGE_SECONDS,
        path="/",
    )
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=SESSION_COOKIE_MAX_AGE_SECONDS,
        path="/",
    )
    return response


@router.post(
    "/resend-code",
    response_model=DetailResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(rate_limit("resend_code", max_calls=2, window_seconds=60))],
)
async def resend_confirmation_code(
    data: ResendCodeRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> DetailResponse:
    "Повторно отправляет код подтверждения почты — для случая, когда пользователь закрыл вкладку."
    await ResendConfirmationUseCase(build_repo(db), build_notifier(db)).execute(
        data.email, background_tasks, data.role
    )
    return DetailResponse(detail="Код отправлен повторно")


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
    mining_license_file: UploadFile | None = File(None),
    sro_design_file: UploadFile | None = File(None),
    lab_accreditation_file: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    "Регистрирует лицензиата: сохраняет основной файл лицензии + (опц.) 3 дополнительных регуляторных документа."
    file_url = await save_license_file(data.inn, license_file) if license_file else None
    mining_url = await save_mining_license_file(data.inn, mining_license_file) if mining_license_file else None
    sro_url = await save_sro_design_file(data.inn, sro_design_file) if sro_design_file else None
    lab_url = await save_lab_accreditation_file(data.inn, lab_accreditation_file) if lab_accreditation_file else None

    repo = build_repo(db)
    try:
        user = await RegisterLicenseHolderUseCase(repo, build_validator(repo)).execute(
            data,
            file_url,
            mining_license_file_url=mining_url,
            sro_design_file_url=sro_url,
            lab_accreditation_file_url=lab_url,
        )
    except Exception:
        remove_license_file(file_url)
        remove_regulatory_document_file(mining_url)
        remove_regulatory_document_file(sro_url)
        remove_regulatory_document_file(lab_url)
        raise

    await build_notifier(db).schedule_confirmation_email(user, background_tasks)
    return UserResponse.model_validate(user)


@router.post(
    "/party-suggestions",
    response_model=list[PartySuggestionResponse],
    dependencies=[Depends(rate_limit("party_suggestions", max_calls=10, window_seconds=60))],
)
async def get_party_suggestions(payload: PartySuggestionRequest) -> list[PartySuggestionResponse]:
    "Возвращает подсказки организаций из DaData по поисковой строке."
    service = DaDataService()
    raw = await service.suggest_parties(payload.query, payload.count)
    return [PartySuggestionResponse.model_validate(item) for item in raw]
