from fastapi import APIRouter, Depends, File, Response, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.settings import (
    ChangePasswordRequest,
    UpdateEmailPreferencesRequest,
    UpdateLicenseHolderRequest,
    UpdatePersonalDataRequest,
    UserSettingsResponse,
)
from services.settings import SettingsService

router = APIRouter(tags=["settings"])


@router.get("/settings/profile", response_model=UserSettingsResponse)
async def get_profile(
    response: Response,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    user = await service.get_user_or_404(user_id)
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return service.to_response(user)


@router.put("/settings/profile", response_model=UserSettingsResponse)
async def update_profile(
    data: UpdatePersonalDataRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    user = await service.get_user_or_404(user_id)

    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    if data.phone is not None:
        await service.ensure_unique_phone(data.phone, user_id)
        user.phone = data.phone
    if data.email is not None:
        await service.ensure_unique_email(data.email, user_id)
        user.email = data.email
    if data.inn is not None:
        await service.ensure_unique_inn(data.inn, user_id)
        user.inn = data.inn

    await db.flush()
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return service.to_response(user)


@router.put("/settings/email-preferences", response_model=UserSettingsResponse)
async def update_email_preferences(
    data: UpdateEmailPreferencesRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    patch = data.model_dump(exclude_unset=True)
    service = SettingsService(db)
    if not patch:
        user = await service.get_user_or_404(user_id)
    else:
        user = await service.update_email_preferences(user_id, patch)
    return service.to_response(user)


@router.post("/settings/password")
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    await service.update_password(user_id, data.new_password)

    return {"detail": "Пароль успешно изменён"}


@router.post("/settings/avatar", response_model=UserSettingsResponse)
async def upload_avatar(
    response: Response,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    user = await service.upload_avatar(user_id, file)
    response.set_cookie(
        key="user_role",
        value=user.role.value,
        secure=True,
        samesite="none",
        path="/",
    )
    return service.to_response(user)


@router.put("/settings/license", response_model=UserSettingsResponse)
async def update_license(
    data: UpdateLicenseHolderRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    user = await service.update_license_holder(user_id, data)
    return service.to_response(user)


@router.post("/settings/license-file", response_model=UserSettingsResponse)
async def upload_license_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = SettingsService(db)
    user = await service.replace_license_file(user_id, file)
    return service.to_response(user)
