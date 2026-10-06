"""Однократное начисление вознаграждения в пределах общего фонда."""

from datetime import UTC, datetime

from models.account import Account
from models.referral import BonusTransaction, Referral, ReferralCampaign, ReferralStatus
from services.referrals.bonus_repository import BonusRepository
from services.referrals.repository import ReferralRepository
from services.referrals.validators import ReferralValidator, is_active_expert


class RewardReferralUseCase:
    """Меняет фонд, приглашение и бонусный счёт в общей транзакции."""

    def __init__(
        self,
        repo: ReferralRepository,
        validator: ReferralValidator,
        bonuses: BonusRepository,
    ) -> None:
        self.repo = repo
        self.validator = validator
        self.bonuses = bonuses

    async def execute(self, user_id: int) -> None:
        """Начисляет бонус пригласившему, когда коллега выполнил условия программы."""
        await self.repo.flush()
        referral = await self.repo.find_for_invited(user_id)
        if referral is None or referral.status != ReferralStatus.PENDING:
            return

        campaign = await self.repo.get_campaign(for_update=True)
        referral = await self.repo.find_for_invited(user_id)
        if referral is None or referral.status != ReferralStatus.PENDING:
            return
        if not await self.validator.can_reward(referral):
            return

        inviter = await self.find_active_inviter(referral)
        if inviter is None:
            await self.finish(referral, ReferralStatus.REJECTED)
            return
        if not campaign.is_active:
            return
        if campaign.remaining_kopecks < campaign.reward_kopecks:
            await self.finish(referral, ReferralStatus.POOL_EXHAUSTED)
            return

        await self.credit_reward(referral, inviter, campaign)

    async def find_active_inviter(self, referral: Referral) -> Account | None:
        """Возвращает пригласившего, если он сохранил право получить бонус."""
        if referral.inviter_id is None:
            return None
        inviter = await self.repo.find_account(referral.inviter_id)
        return inviter if is_active_expert(inviter) else None

    async def finish(self, referral: Referral, status: ReferralStatus) -> None:
        """Сохраняет окончательный статус приглашения без начисления бонуса."""
        referral.status = status
        await self.repo.flush()

    async def credit_reward(self, referral: Referral, inviter: Account, campaign: ReferralCampaign) -> None:
        """Увеличивает бонусный баланс и записывает вознаграждение в фонд и журнал."""
        account = await self.bonuses.get_account_for_update(inviter.id)
        account.balance_kopecks += campaign.reward_kopecks
        campaign.spent_kopecks += campaign.reward_kopecks
        referral.status = ReferralStatus.REWARDED
        referral.rewarded_at = datetime.now(UTC)

        transaction = BonusTransaction(
            user_id=inviter.id,
            referral_id=referral.id,
            amount_kopecks=campaign.reward_kopecks,
        )
        await self.bonuses.add_transaction(transaction)
