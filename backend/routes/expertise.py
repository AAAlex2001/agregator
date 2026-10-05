"""Экспертиза промышленной безопасности: анкета исполнителя."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.referral import get_reward_referral_use_case
from schemas.expertise import ExpertiseProfileInput, ExpertiseProfileResponse
from services.expertise import (
    ExpertiseRepository,
    ExpertiseValidator,
    GetExpertiseProfileUseCase,
    SaveExpertiseProfileUseCase,
)
from services.referrals import RewardReferralUseCase

router = APIRouter(prefix="/directions/expertise", tags=["directions"])


@router.get("/profile", response_model=ExpertiseProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertiseProfileResponse:
    """Анкета исполнителя по экспертизе промышленной безопасности."""
    validator = ExpertiseValidator(ExpertiseRepository(db))
    return await GetExpertiseProfileUseCase(validator).execute(user_id)


@router.put("/profile", response_model=ExpertiseProfileResponse)
async def save_profile(
    data: ExpertiseProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
    referrals: RewardReferralUseCase = Depends(get_reward_referral_use_case),
) -> ExpertiseProfileResponse:
    """Сохраняет удостоверения исполнителя по ЭПБ."""
    repo = ExpertiseRepository(db)
    use_case = SaveExpertiseProfileUseCase(repo, ExpertiseValidator(repo))
    result = await use_case.execute(user_id, data)
    await referrals.execute(user_id)
    return result
