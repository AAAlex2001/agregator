"""Данные реферального блока в личном кабинете исполнителя."""

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
        """Создаёт сценарий чтения реферального кабинета."""
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
            referral_code=account.public_id,
            referral_url=f"{self.public_base_url}/register?ref={account.public_id}",
            reward_kopecks=campaign.reward_kopecks,
            balance_kopecks=balance,
            pool_total_kopecks=campaign.total_kopecks,
            pool_remaining_kopecks=campaign.remaining_kopecks,
            accepting_referrals=campaign.is_active and campaign.remaining_kopecks >= campaign.reward_kopecks,
            invited_count=counts.total_count,
            pending_count=counts.pending_count,
            rewarded_count=counts.rewarded_count,
            pool_exhausted_count=counts.pool_exhausted_count,
            rejected_count=counts.rejected_count,
        )
