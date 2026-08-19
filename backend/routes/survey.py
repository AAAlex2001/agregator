"""Инженерные изыскания: анкеты изыскателя и держателя-члена СРО, справочники."""
from fastapi import APIRouter, Body, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.common import DocumentUrl
from schemas.survey import (
    SurveyCatalogsResponse,
    SurveyExpertProfileInput,
    SurveyExpertProfileResponse,
    SurveyLicenseHolderProfileInput,
    SurveyLicenseHolderProfileResponse,
)
from services.survey import (
    DeleteSurveyDocumentUseCase,
    DeleteSurveyHolderDocumentUseCase,
    GetSurveyExpertProfileUseCase,
    GetSurveyLicenseHolderProfileUseCase,
    SaveSurveyExpertProfileUseCase,
    SaveSurveyLicenseHolderProfileUseCase,
    SurveyRepository,
    SurveyValidator,
    UploadSurveyDocumentUseCase,
    UploadSurveyHolderDocumentUseCase,
)
from services.survey.catalogs import build_survey_catalogs

router = APIRouter(prefix="/directions/survey", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


def build_validator(db: AsyncSession) -> SurveyValidator:
    return SurveyValidator(SurveyRepository(db))


@router.get("/catalogs", response_model=SurveyCatalogsResponse)
async def get_catalogs() -> SurveyCatalogsResponse:
    """Справочники направления: виды изысканий и области аттестации РТН."""
    return build_survey_catalogs()


@router.get("/expert-profile", response_model=SurveyExpertProfileResponse)
async def get_expert_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyExpertProfileResponse:
    """Анкета изыскателя."""
    return await GetSurveyExpertProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/expert-profile", response_model=SurveyExpertProfileResponse)
async def save_expert_profile(
    data: SurveyExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyExpertProfileResponse:
    """Сохраняет анкету изыскателя: образование, направления изысканий, НОК, НРС и аттестация РТН."""
    repo = SurveyRepository(db)
    use_case = SaveSurveyExpertProfileUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, data)


@router.get("/license-holder-profile", response_model=SurveyLicenseHolderProfileResponse)
async def get_license_holder_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyLicenseHolderProfileResponse:
    """Анкета держателя — члена СРО изыскателей."""
    return await GetSurveyLicenseHolderProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/license-holder-profile", response_model=SurveyLicenseHolderProfileResponse)
async def save_license_holder_profile(
    data: SurveyLicenseHolderProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyLicenseHolderProfileResponse:
    """Сохраняет анкету члена СРО: членство, права, компенсационный фонд и стоимость услуг."""
    repo = SurveyRepository(db)
    use_case = SaveSurveyLicenseHolderProfileUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/expert-profile/documents", response_model=SurveyExpertProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    group: str = Query(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyExpertProfileResponse:
    """Прикладывает документ к группе анкеты изыскателя: диплом, НОК, НРС, курсы или протокол РТН."""
    repo = SurveyRepository(db)
    use_case = UploadSurveyDocumentUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, group, file)


@router.delete("/expert-profile/documents", response_model=SurveyExpertProfileResponse)
async def delete_document(
    group: str = Query(...),
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyExpertProfileResponse:
    """Убирает документ из группы анкеты изыскателя."""
    repo = SurveyRepository(db)
    use_case = DeleteSurveyDocumentUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, group, data.url)


@router.post("/license-holder-profile/documents", response_model=SurveyLicenseHolderProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_holder_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyLicenseHolderProfileResponse:
    """Прикладывает дополнительный документ к анкете члена СРО."""
    repo = SurveyRepository(db)
    use_case = UploadSurveyHolderDocumentUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/license-holder-profile/documents", response_model=SurveyLicenseHolderProfileResponse)
async def delete_holder_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SurveyLicenseHolderProfileResponse:
    """Убирает дополнительный документ из анкеты члена СРО."""
    repo = SurveyRepository(db)
    use_case = DeleteSurveyHolderDocumentUseCase(repo, SurveyValidator(repo))
    return await use_case.execute(user_id, data.url)
