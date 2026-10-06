"""Данные реферального блока в личном кабинете исполнителя."""

from models.referral import ReferralStatus
from schemas.referral import ReferralOverview
from services.referrals.bonus_repository import BonusRepository
from services.referrals.repository import ReferralRepository
from services.referrals.validators import ReferralValidator


class GetReferralOverviewUseCase:
    """Читает ссылку, счётчики и баланс без создания дополнительных записей."""

    def __init__(
        self,
        repo: ReferralRepository,
        validator: ReferralValidator,
        bonuses: BonusRepository,
        public_base_url: str,
    ) -> None:
        self.repo = repo
        self.validator = validator
        self.bonuses = bonuses
        self.public_base_url = public_base_url.rstrip("/")

    async def execute(self, user_id: int) -> ReferralOverview:
        """Собирает персональную ссылку, бонусный баланс и счётчики приглашений."""
        account = await self.validator.require_expert(user_id)
        campaign = await self.repo.get_campaign()
        counts = await self.repo.count_by_status(user_id)
        balance = await self.bonuses.get_balance(user_id)

        return ReferralOverview(
            referral_url=f"{self.public_base_url}/register?ref={account.public_id}",
            reward_kopecks=campaign.reward_kopecks,
            balance_kopecks=balance,
            pool_total_kopecks=campaign.total_kopecks,
            pool_remaining_kopecks=campaign.remaining_kopecks,
            accepting_referrals=campaign.is_active and campaign.remaining_kopecks >= campaign.reward_kopecks,
            invited_count=sum(counts.values()),
            pending_count=counts.get(ReferralStatus.PENDING, 0),
            rewarded_count=counts.get(ReferralStatus.REWARDED, 0),
            pool_exhausted_count=counts.get(ReferralStatus.POOL_EXHAUSTED, 0),
            rejected_count=counts.get(ReferralStatus.REJECTED, 0),
        )
