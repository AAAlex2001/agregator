"""HTTP-контракт реферального блока в кабинете исполнителя."""

from fastapi import APIRouter, Depends

from dependencies.auth import get_current_user
from dependencies.referral import get_referral_overview_use_case
from schemas.referral import ReferralOverview
from services.referrals import GetReferralOverviewUseCase

router = APIRouter(prefix="/referrals", tags=["referrals"])


@router.get("/me", response_model=ReferralOverview)
async def get_referral_overview(
    user_id: int = Depends(get_current_user),
    use_case: GetReferralOverviewUseCase = Depends(get_referral_overview_use_case),
) -> ReferralOverview:
    """Обрабатывает запрос данных реферального блока личного кабинета."""
    return await use_case.execute(user_id)
