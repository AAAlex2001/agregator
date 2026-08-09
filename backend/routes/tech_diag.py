"""Техдиагностирование: анкеты специалиста НК и лаборатории, справочники."""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.common import DocumentUrl
from schemas.tech_diag import (
    TechDiagCatalogsResponse,
    TechDiagExpertProfileInput,
    TechDiagExpertProfileResponse,
    TechDiagLicenseHolderProfileInput,
    TechDiagLicenseHolderProfileResponse,
)
from services.tech_diag import (
    DeleteTechDiagDocumentUseCase,
    GetTechDiagExpertProfileUseCase,
    GetTechDiagLicenseHolderProfileUseCase,
    SaveTechDiagExpertProfileUseCase,
    SaveTechDiagLicenseHolderProfileUseCase,
    TechDiagRepository,
    TechDiagValidator,
    UploadTechDiagDocumentUseCase,
)
from services.tech_diag.catalogs import build_tech_diag_catalogs

router = APIRouter(prefix="/directions/tech-diag", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


def build_validator(db: AsyncSession) -> TechDiagValidator:
    return TechDiagValidator(TechDiagRepository(db))


@router.get("/catalogs", response_model=TechDiagCatalogsResponse)
async def get_catalogs() -> TechDiagCatalogsResponse:
    """Справочники направления: виды НК и объекты контроля по СДАНК-02-2020."""
    return build_tech_diag_catalogs()


@router.get("/expert-profile", response_model=TechDiagExpertProfileResponse)
async def get_expert_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagExpertProfileResponse:
    """Анкета специалиста НК (дефектоскописта)."""
    return await GetTechDiagExpertProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/expert-profile", response_model=TechDiagExpertProfileResponse)
async def save_expert_profile(
    data: TechDiagExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagExpertProfileResponse:
    """Сохраняет анкету специалиста НК: удостоверения, виды и объекты контроля."""
    repo = TechDiagRepository(db)
    use_case = SaveTechDiagExpertProfileUseCase(repo, TechDiagValidator(repo))
    return await use_case.execute(user_id, data)


@router.get("/license-holder-profile", response_model=TechDiagLicenseHolderProfileResponse)
async def get_license_holder_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagLicenseHolderProfileResponse:
    """Анкета лаборатории неразрушающего контроля."""
    return await GetTechDiagLicenseHolderProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/license-holder-profile", response_model=TechDiagLicenseHolderProfileResponse)
async def save_license_holder_profile(
    data: TechDiagLicenseHolderProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagLicenseHolderProfileResponse:
    """Сохраняет анкету лаборатории: виды контроля и город организации."""
    repo = TechDiagRepository(db)
    use_case = SaveTechDiagLicenseHolderProfileUseCase(repo, TechDiagValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/expert-profile/documents", response_model=TechDiagExpertProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagExpertProfileResponse:
    """Прикладывает квалификационное удостоверение к анкете специалиста НК."""
    repo = TechDiagRepository(db)
    use_case = UploadTechDiagDocumentUseCase(repo, TechDiagValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/expert-profile/documents", response_model=TechDiagExpertProfileResponse)
async def delete_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> TechDiagExpertProfileResponse:
    """Убирает удостоверение из анкеты специалиста НК."""
    repo = TechDiagRepository(db)
    use_case = DeleteTechDiagDocumentUseCase(repo, TechDiagValidator(repo))
    return await use_case.execute(user_id, data.url)
