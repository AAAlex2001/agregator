"""Аудит СУПБ: анкеты заказчика, аудитора и инспекционного органа, файлы заявки."""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.audit import (
    AuditCatalogsResponse,
    AuditCustomerProfileInput,
    AuditCustomerProfileResponse,
    AuditExpertProfileInput,
    AuditExpertProfileResponse,
    AuditLicenseHolderProfileInput,
    AuditLicenseHolderProfileResponse,
)
from schemas.common import DirectionFileSchema, DocumentUrl
from services.audit import (
    AuditRepository,
    AuditValidator,
    DeleteAuditDocumentUseCase,
    GetAuditCustomerProfileUseCase,
    GetAuditExpertProfileUseCase,
    GetAuditLicenseHolderProfileUseCase,
    SaveAuditCustomerProfileUseCase,
    SaveAuditExpertProfileUseCase,
    SaveAuditLicenseHolderProfileUseCase,
    UploadAuditDocumentUseCase,
    UploadAuditOrderFileUseCase,
)
from services.audit.catalogs import build_audit_catalogs

router = APIRouter(prefix="/directions/audit", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


def build_validator(db: AsyncSession) -> AuditValidator:
    return AuditValidator(AuditRepository(db))


@router.get("/catalogs", response_model=AuditCatalogsResponse)
async def get_catalogs() -> AuditCatalogsResponse:
    """Справочники аудита СУПБ: аттестации, НОК, аккредитация, направления п.17."""
    return build_audit_catalogs()


@router.get("/customer-profile", response_model=AuditCustomerProfileResponse)
async def get_customer_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditCustomerProfileResponse:
    """Анкета заказчика по аудиту СУПБ."""
    return await GetAuditCustomerProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/customer-profile", response_model=AuditCustomerProfileResponse)
async def save_customer_profile(
    data: AuditCustomerProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditCustomerProfileResponse:
    """Сохраняет анкету заказчика: должность представителя и лицензию на ОПО."""
    repo = AuditRepository(db)
    use_case = SaveAuditCustomerProfileUseCase(repo, AuditValidator(repo))
    return await use_case.execute(user_id, data)


@router.get("/expert-profile", response_model=AuditExpertProfileResponse)
async def get_expert_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditExpertProfileResponse:
    """Анкета исполнителя-аудитора по аудиту СУПБ."""
    return await GetAuditExpertProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/expert-profile", response_model=AuditExpertProfileResponse)
async def save_expert_profile(
    data: AuditExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditExpertProfileResponse:
    """Сохраняет анкету исполнителя-аудитора: аттестации и НОК."""
    repo = AuditRepository(db)
    use_case = SaveAuditExpertProfileUseCase(repo, AuditValidator(repo))
    return await use_case.execute(user_id, data)


@router.get("/license-holder-profile", response_model=AuditLicenseHolderProfileResponse)
async def get_license_holder_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditLicenseHolderProfileResponse:
    """Анкета инспекционного органа — держателя разрешительных документов."""
    return await GetAuditLicenseHolderProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/license-holder-profile", response_model=AuditLicenseHolderProfileResponse)
async def save_license_holder_profile(
    data: AuditLicenseHolderProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditLicenseHolderProfileResponse:
    """Сохраняет анкету инспекционного органа: свидетельство и области аккредитации."""
    repo = AuditRepository(db)
    use_case = SaveAuditLicenseHolderProfileUseCase(repo, AuditValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/expert-profile/documents", response_model=AuditExpertProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditExpertProfileResponse:
    """Прикладывает документ к анкете аудитора."""
    repo = AuditRepository(db)
    use_case = UploadAuditDocumentUseCase(repo, AuditValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/expert-profile/documents", response_model=AuditExpertProfileResponse)
async def delete_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> AuditExpertProfileResponse:
    """Убирает документ из анкеты аудитора."""
    repo = AuditRepository(db)
    use_case = DeleteAuditDocumentUseCase(repo, AuditValidator(repo))
    return await use_case.execute(user_id, data.url)


@router.post("/order-files", response_model=DirectionFileSchema, dependencies=[UPLOAD_LIMIT])
async def upload_order_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DirectionFileSchema:
    """Файл для заявки на аудит: СТО или свидетельство о регистрации ОПО."""
    return await UploadAuditOrderFileUseCase(build_validator(db)).execute(user_id, file)
