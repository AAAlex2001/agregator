"""Лабораторные исследования: анкета исполнителя."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.laboratory import LaboratoryProfileInput, LaboratoryProfileResponse
from services.laboratory import (
    GetLaboratoryProfileUseCase,
    LaboratoryRepository,
    LaboratoryValidator,
    SaveLaboratoryProfileUseCase,
)

router = APIRouter(prefix="/directions/laboratory", tags=["directions"])


@router.get("/profile", response_model=LaboratoryProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaboratoryProfileResponse:
    """Анкета исполнителя лабораторных исследований текущего пользователя."""
    validator = LaboratoryValidator(LaboratoryRepository(db))
    return await GetLaboratoryProfileUseCase(validator).execute(user_id)


@router.put("/profile", response_model=LaboratoryProfileResponse)
async def save_profile(
    data: LaboratoryProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaboratoryProfileResponse:
    """Сохраняет анкету исполнителя лабораторных исследований."""
    repo = LaboratoryRepository(db)
    use_case = SaveLaboratoryProfileUseCase(repo, LaboratoryValidator(repo))
    return await use_case.execute(user_id, data)
