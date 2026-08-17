"""Экология: анкета эколога и справочник видов работ."""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.common import DocumentUrl
from schemas.ecology import (
    EcologyCatalogsResponse,
    EcologyExpertProfileInput,
    EcologyExpertProfileResponse,
)
from services.ecology import (
    DeleteEcologyDocumentUseCase,
    EcologyRepository,
    EcologyValidator,
    GetEcologyExpertProfileUseCase,
    SaveEcologyExpertProfileUseCase,
    UploadEcologyDocumentUseCase,
)
from services.ecology.catalogs import build_ecology_catalogs

router = APIRouter(prefix="/directions/ecology", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


@router.get("/catalogs", response_model=EcologyCatalogsResponse)
async def get_catalogs() -> EcologyCatalogsResponse:
    """Справочник направления: виды экологических работ."""
    return build_ecology_catalogs()


@router.get("/expert-profile", response_model=EcologyExpertProfileResponse)
async def get_expert_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> EcologyExpertProfileResponse:
    """Анкета эколога."""
    return await GetEcologyExpertProfileUseCase(EcologyValidator(EcologyRepository(db))).execute(user_id)


@router.put("/expert-profile", response_model=EcologyExpertProfileResponse)
async def save_expert_profile(
    data: EcologyExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> EcologyExpertProfileResponse:
    """Сохраняет анкету эколога: виды работ и практические навыки."""
    repo = EcologyRepository(db)
    use_case = SaveEcologyExpertProfileUseCase(repo, EcologyValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/expert-profile/documents", response_model=EcologyExpertProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> EcologyExpertProfileResponse:
    """Прикладывает подтверждающий документ к анкете эколога."""
    repo = EcologyRepository(db)
    use_case = UploadEcologyDocumentUseCase(repo, EcologyValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/expert-profile/documents", response_model=EcologyExpertProfileResponse)
async def delete_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> EcologyExpertProfileResponse:
    """Убирает подтверждающий документ из анкеты эколога."""
    repo = EcologyRepository(db)
    use_case = DeleteEcologyDocumentUseCase(repo, EcologyValidator(repo))
    return await use_case.execute(user_id, data.url)
