from fastapi import APIRouter, BackgroundTasks, Depends, File, Response, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.common import DetailResponse
from schemas.settings import (
    ChangePasswordRequest,
    ConfirmEmailChangeRequest,
    RequestEmailChangeRequest,
    UpdateEmailPreferencesRequest,
    UpdateLicenseHolderRequest,
    UpdateOrderNotificationsRequest,
    UpdatePersonalDataRequest,
    UserSettingsResponse,
)
from services.settings import (
    ClearCompanyCardUseCase,
    ConfirmEmailChangeUseCase,
    GetProfileUseCase,
    MarkNotificationsIntroducedUseCase,
    ReplaceCompanyCardUseCase,
    ReplaceLicenseFileUseCase,
    RequestEmailChangeUseCase,
    SettingsRepository,
    SettingsValidator,
    UpdateEmailPreferencesUseCase,
    UpdateLicenseTermsUseCase,
    UpdateOrderNotificationsUseCase,
    UpdatePasswordUseCase,
    UpdatePersonalDataUseCase,
    UploadAvatarUseCase,
    to_response,
)

router = APIRouter(tags=["settings"])


def build_repo(db: AsyncSession) -> SettingsRepository:
    return SettingsRepository(db)


def build_validator(repo: SettingsRepository) -> SettingsValidator:
    return SettingsValidator(repo)


@router.get("/settings/profile", response_model=UserSettingsResponse)
async def get_profile(
    response: Response,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Возвращает профиль текущего пользователя и синхронизирует cookie роли."
    repo = build_repo(db)
    user = await GetProfileUseCase(build_validator(repo)).execute(user_id)
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return to_response(user)


@router.put("/settings/profile", response_model=UserSettingsResponse)
async def update_profile(
    data: UpdatePersonalDataRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Обновляет личные данные пользователя и обновляет cookie роли."
    repo = build_repo(db)
    user = await UpdatePersonalDataUseCase(repo, build_validator(repo)).execute(user_id, data)
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return to_response(user)


@router.put("/settings/email-preferences", response_model=UserSettingsResponse)
async def update_email_preferences(
    data: UpdateEmailPreferencesRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Обновляет настройки email-уведомлений; пустой patch возвращает профиль без изменений."
    repo = build_repo(db)
    validator = build_validator(repo)
    patch = data.model_dump(exclude_unset=True)
    if not patch:
        user = await GetProfileUseCase(validator).execute(user_id)
    else:
        user = await UpdateEmailPreferencesUseCase(repo, validator).execute(user_id, patch)
    return to_response(user)


@router.put("/settings/order-notifications", response_model=UserSettingsResponse)
async def update_order_notifications(
    data: UpdateOrderNotificationsRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Обновляет подписку эксперта на типы новых заказов."
    repo = build_repo(db)
    user = await UpdateOrderNotificationsUseCase(repo, build_validator(repo)).execute(
        user_id, data.order_types
    )
    return to_response(user)


@router.post("/settings/notifications-introduced", response_model=UserSettingsResponse)
async def mark_notifications_introduced(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Помечает пользователя как ознакомленного с системой уведомлений."
    repo = build_repo(db)
    user = await MarkNotificationsIntroducedUseCase(repo, build_validator(repo)).execute(user_id)
    return to_response(user)


@router.post(
    "/settings/password",
    response_model=DetailResponse,
    dependencies=[Depends(rate_limit("settings_password", max_calls=5, window_seconds=60))],
)
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DetailResponse:
    "Меняет пароль текущего пользователя."
    repo = build_repo(db)
    await UpdatePasswordUseCase(repo, build_validator(repo)).execute(user_id, data.new_password)
    return DetailResponse(detail="Пароль успешно изменён")


@router.post(
    "/settings/email/request-change",
    response_model=DetailResponse,
    dependencies=[Depends(rate_limit("settings_email_request", max_calls=2, window_seconds=60))],
)
async def request_email_change(
    data: RequestEmailChangeRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DetailResponse:
    "Запрашивает смену email; отправляет код подтверждения на новый адрес."
    repo = build_repo(db)
    await RequestEmailChangeUseCase(repo, build_validator(repo)).execute(
        user_id, data.new_email, background_tasks
    )
    return DetailResponse(detail="Код отправлен на новый адрес")


@router.post(
    "/settings/email/confirm-change",
    response_model=UserSettingsResponse,
    dependencies=[Depends(rate_limit("settings_email_confirm", max_calls=5, window_seconds=60))],
)
async def confirm_email_change(
    data: ConfirmEmailChangeRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Подтверждает смену email по коду."
    repo = build_repo(db)
    user = await ConfirmEmailChangeUseCase(repo, build_validator(repo)).execute(user_id, data.code)
    return to_response(user)


@router.post("/settings/avatar", response_model=UserSettingsResponse)
async def upload_avatar(
    response: Response,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Загружает аватар пользователя и обновляет cookie роли."
    repo = build_repo(db)
    user = await UploadAvatarUseCase(repo, build_validator(repo)).execute(user_id, file)
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return to_response(user)


@router.put("/settings/license", response_model=UserSettingsResponse)
async def update_license(
    data: UpdateLicenseHolderRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Обновляет реквизиты и условия лицензиата."
    repo = build_repo(db)
    user = await UpdateLicenseTermsUseCase(repo, build_validator(repo)).execute(user_id, data)
    return to_response(user)


@router.post("/settings/license-file", response_model=UserSettingsResponse)
async def upload_license_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Заменяет загруженный файл лицензии."
    repo = build_repo(db)
    user = await ReplaceLicenseFileUseCase(repo, build_validator(repo)).execute(user_id, file)
    return to_response(user)


@router.post("/settings/company-card", response_model=UserSettingsResponse)
async def upload_company_card(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Загружает или заменяет карточку компании пользователя."
    repo = build_repo(db)
    user = await ReplaceCompanyCardUseCase(repo, build_validator(repo)).execute(user_id, file)
    return to_response(user)


@router.delete("/settings/company-card", response_model=UserSettingsResponse)
async def delete_company_card(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> UserSettingsResponse:
    "Удаляет загруженную карточку компании пользователя."
    repo = build_repo(db)
    user = await ClearCompanyCardUseCase(repo, build_validator(repo)).execute(user_id)
    return to_response(user)
