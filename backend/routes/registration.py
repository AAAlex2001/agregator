from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.contact_deal import build_contact_cipher
from dependencies.rate_limit import rate_limit
from dependencies.registration import (
    get_login_repository,
    get_registration_notifier,
    get_registration_repository,
    get_registration_validator,
    get_verification_service,
    parse_license_holder_payload,
    parse_user_payload,
)
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
    save_sro_survey_file,
)
from services.login import CreateSessionUseCase, LoginRepository, set_session_cookies
from services.registration import (
    ConfirmEmailUseCase,
    RegisterLicenseHolderUseCase,
    RegisterUserUseCase,
    RegistrationNotifier,
    RegistrationRepository,
    RegistrationValidator,
    ResendConfirmationUseCase,
)
from services.registration.direction_documents import attach_documents
from services.verification import VerificationService

router = APIRouter(prefix="/register", tags=["auth"])


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("register", max_calls=3, window_seconds=60))],
)
async def register_user(
    background_tasks: BackgroundTasks,
    data: UserRegistration = Depends(parse_user_payload),
    documents: list[UploadFile] = File(default=[]),
    document_directions: list[str] = Form(default=[]),
    db: AsyncSession = Depends(get_db),
    repository: RegistrationRepository = Depends(get_registration_repository),
    validator: RegistrationValidator = Depends(get_registration_validator),
    notifier: RegistrationNotifier = Depends(get_registration_notifier),
) -> UserResponse:
    "Регистрирует обычного пользователя, прикладывает дипломы направлений и шлёт письмо подтверждения."
    cipher = build_contact_cipher() if data.contact_sales_enabled else None
    user = await RegisterUserUseCase(repository, validator, cipher).execute(data)
    await attach_documents(db, user.id, document_directions, documents)
    await notifier.schedule_confirmation_email(user, background_tasks)
    return UserResponse.from_account(user)


@router.post(
    "/confirm-email",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit("confirm_email", max_calls=5, window_seconds=60))],
)
async def confirm_email(
    data: EmailConfirmRequest,
    repository: RegistrationRepository = Depends(get_registration_repository),
    verification: VerificationService = Depends(get_verification_service),
    login_repository: LoginRepository = Depends(get_login_repository),
) -> JSONResponse:
    "Подтверждает email и сразу выдаёт сессию — пользователь после ввода кода попадает в кабинет."
    user = await ConfirmEmailUseCase(repository, verification).execute(data.email, data.code, data.role)
    session = await CreateSessionUseCase(login_repository).execute(user.id)

    response = JSONResponse(content=UserResponse.from_account(user).model_dump(mode="json"))
    set_session_cookies(response, session.session_id, user.role.value)
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
    repository: RegistrationRepository = Depends(get_registration_repository),
    notifier: RegistrationNotifier = Depends(get_registration_notifier),
) -> DetailResponse:
    "Повторно отправляет код подтверждения почты — для случая, когда пользователь закрыл вкладку."
    await ResendConfirmationUseCase(repository, notifier).execute(data.email, background_tasks, data.role)
    return DetailResponse(detail="Код отправлен повторно")


@router.post(
    "/license-holder",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("register", max_calls=3, window_seconds=60))],
)
async def register_license_holder(
    background_tasks: BackgroundTasks,
    data: LicenseHolderRegistration = Depends(parse_license_holder_payload),
    license_file: UploadFile | None = File(None),
    mining_license_file: UploadFile | None = File(None),
    sro_design_file: UploadFile | None = File(None),
    sro_survey_file: UploadFile | None = File(None),
    lab_accreditation_file: UploadFile | None = File(None),
    repository: RegistrationRepository = Depends(get_registration_repository),
    validator: RegistrationValidator = Depends(get_registration_validator),
    notifier: RegistrationNotifier = Depends(get_registration_notifier),
) -> UserResponse:
    "Регистрирует лицензиата и сохраняет приложенные разрешительные документы."
    file_url = await save_license_file(data.inn, license_file) if license_file else None
    mining_url = (
        await save_mining_license_file(data.inn, mining_license_file) if mining_license_file else None
    )
    sro_url = await save_sro_design_file(data.inn, sro_design_file) if sro_design_file else None
    sro_survey_url = await save_sro_survey_file(data.inn, sro_survey_file) if sro_survey_file else None
    lab_url = (
        await save_lab_accreditation_file(data.inn, lab_accreditation_file)
        if lab_accreditation_file
        else None
    )

    try:
        user = await RegisterLicenseHolderUseCase(repository, validator).execute(
            data,
            file_url,
            mining_license_file_url=mining_url,
            sro_design_file_url=sro_url,
            sro_survey_file_url=sro_survey_url,
            lab_accreditation_file_url=lab_url,
        )
    except Exception:
        remove_license_file(file_url)
        remove_regulatory_document_file(mining_url)
        remove_regulatory_document_file(sro_url)
        remove_regulatory_document_file(sro_survey_url)
        remove_regulatory_document_file(lab_url)
        raise

    await notifier.schedule_confirmation_email(user, background_tasks)
    return UserResponse.from_account(user)


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
