"""Проектирование: анкеты проектировщика и держателя-члена СРО, справочники."""
from fastapi import APIRouter, Body, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.common import DocumentUrl
from schemas.design import (
    DesignCatalogsResponse,
    DesignExpertProfileInput,
    DesignExpertProfileResponse,
    DesignLicenseHolderProfileInput,
    DesignLicenseHolderProfileResponse,
)
from services.design import (
    DeleteDesignDocumentUseCase,
    DeleteDesignHolderDocumentUseCase,
    DesignRepository,
    DesignValidator,
    GetDesignExpertProfileUseCase,
    GetDesignLicenseHolderProfileUseCase,
    SaveDesignExpertProfileUseCase,
    SaveDesignLicenseHolderProfileUseCase,
    UploadDesignDocumentUseCase,
    UploadDesignHolderDocumentUseCase,
)
from services.design.catalogs import build_design_catalogs

router = APIRouter(prefix="/directions/design", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


def build_validator(db: AsyncSession) -> DesignValidator:
    return DesignValidator(DesignRepository(db))


@router.get("/catalogs", response_model=DesignCatalogsResponse)
async def get_catalogs() -> DesignCatalogsResponse:
    """Справочники направления: специальности и области аттестации РТН."""
    return build_design_catalogs()


@router.get("/expert-profile", response_model=DesignExpertProfileResponse)
async def get_expert_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignExpertProfileResponse:
    """Анкета проектировщика."""
    return await GetDesignExpertProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/expert-profile", response_model=DesignExpertProfileResponse)
async def save_expert_profile(
    data: DesignExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignExpertProfileResponse:
    """Сохраняет анкету проектировщика: образование, специальности, НОК, НРС и аттестация РТН."""
    repo = DesignRepository(db)
    use_case = SaveDesignExpertProfileUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, data)


@router.get("/license-holder-profile", response_model=DesignLicenseHolderProfileResponse)
async def get_license_holder_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignLicenseHolderProfileResponse:
    """Анкета держателя — члена СРО проектировщиков."""
    return await GetDesignLicenseHolderProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/license-holder-profile", response_model=DesignLicenseHolderProfileResponse)
async def save_license_holder_profile(
    data: DesignLicenseHolderProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignLicenseHolderProfileResponse:
    """Сохраняет анкету члена СРО: членство, права, компенсационный фонд и стоимость услуг."""
    repo = DesignRepository(db)
    use_case = SaveDesignLicenseHolderProfileUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/expert-profile/documents", response_model=DesignExpertProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    group: str = Query(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignExpertProfileResponse:
    """Прикладывает документ к группе анкеты проектировщика: диплом, НОК, НРС, курсы или протокол РТН."""
    repo = DesignRepository(db)
    use_case = UploadDesignDocumentUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, group, file)


@router.delete("/expert-profile/documents", response_model=DesignExpertProfileResponse)
async def delete_document(
    group: str = Query(...),
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignExpertProfileResponse:
    """Убирает документ из группы анкеты проектировщика."""
    repo = DesignRepository(db)
    use_case = DeleteDesignDocumentUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, group, data.url)


@router.post("/license-holder-profile/documents", response_model=DesignLicenseHolderProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_holder_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignLicenseHolderProfileResponse:
    """Прикладывает дополнительный документ к анкете члена СРО."""
    repo = DesignRepository(db)
    use_case = UploadDesignHolderDocumentUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/license-holder-profile/documents", response_model=DesignLicenseHolderProfileResponse)
async def delete_holder_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DesignLicenseHolderProfileResponse:
    """Убирает дополнительный документ из анкеты члена СРО."""
    repo = DesignRepository(db)
    use_case = DeleteDesignHolderDocumentUseCase(repo, DesignValidator(repo))
    return await use_case.execute(user_id, data.url)
