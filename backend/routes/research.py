"""НИР: анкета исполнителя научно-исследовательских работ."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.research import ResearchCatalogsResponse, ResearchProfileInput, ResearchProfileResponse
from services.research import (
    GetResearchProfileUseCase,
    ResearchRepository,
    ResearchValidator,
    SaveResearchProfileUseCase,
)
from services.research.catalogs import build_research_catalogs

router = APIRouter(prefix="/directions/research", tags=["directions"])


@router.get("/catalogs", response_model=ResearchCatalogsResponse)
async def get_catalogs() -> ResearchCatalogsResponse:
    """Справочники направления: учёные степени, отрасли науки и звания."""
    return build_research_catalogs()


@router.get("/profile", response_model=ResearchProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ResearchProfileResponse:
    """Анкета исполнителя НИР текущего пользователя."""
    validator = ResearchValidator(ResearchRepository(db))
    return await GetResearchProfileUseCase(validator).execute(user_id)


@router.put("/profile", response_model=ResearchProfileResponse)
async def save_profile(
    data: ResearchProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ResearchProfileResponse:
    """Сохраняет анкету исполнителя НИР."""
    repo = ResearchRepository(db)
    use_case = SaveResearchProfileUseCase(repo, ResearchValidator(repo))
    return await use_case.execute(user_id, data)
