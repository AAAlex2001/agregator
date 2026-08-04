"""Судебная экспертиза: анкета судебного эксперта."""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.forensic import ForensicProfileInput, ForensicProfileResponse
from services.forensic import (
    DeleteForensicDocumentUseCase,
    ForensicRepository,
    ForensicValidator,
    GetForensicProfileUseCase,
    SaveForensicProfileUseCase,
    UploadForensicDiplomaUseCase,
    UploadForensicDocumentUseCase,
)

router = APIRouter(prefix="/directions/forensic", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


class DocumentUrl(BaseModel):
    """Ссылка на удаляемый документ анкеты."""
    url: str = Field(..., min_length=1, max_length=500)


def build_validator(db: AsyncSession) -> ForensicValidator:
    return ForensicValidator(ForensicRepository(db))


@router.get("/profile", response_model=ForensicProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    """Анкета судебного эксперта текущего исполнителя."""
    return await GetForensicProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/profile", response_model=ForensicProfileResponse)
async def save_profile(
    data: ForensicProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    """Сохраняет анкету судебного эксперта."""
    repo = ForensicRepository(db)
    use_case = SaveForensicProfileUseCase(repo, ForensicValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/profile/diploma", response_model=ForensicProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_diploma(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    """Прикладывает диплом об образовании; прежний файл заменяется."""
    repo = ForensicRepository(db)
    use_case = UploadForensicDiplomaUseCase(repo, ForensicValidator(repo))
    return await use_case.execute(user_id, file)


@router.post("/profile/documents", response_model=ForensicProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    """Прикладывает диплом о доп. образовании или курсах."""
    repo = ForensicRepository(db)
    use_case = UploadForensicDocumentUseCase(repo, ForensicValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/profile/documents", response_model=ForensicProfileResponse)
async def delete_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    """Убирает документ о доп. образовании из анкеты."""
    repo = ForensicRepository(db)
    use_case = DeleteForensicDocumentUseCase(repo, ForensicValidator(repo))
    return await use_case.execute(user_id, data.url)
