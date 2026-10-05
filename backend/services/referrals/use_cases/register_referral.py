"""Привязка приглашённого исполнителя при регистрации."""

from models.account import Account, UserRole
from models.referral import Referral
from services.referrals.repository import ReferralRepository
from services.referrals.validators import ReferralValidator, normalize_email


class RegisterReferralUseCase:
    """Проверяет ссылку до регистрации, сохраняет приглашение после неё."""

    def __init__(self, repo: ReferralRepository, validator: ReferralValidator) -> None:
        """Создаёт сценарий регистрации приглашения."""
        self.repo = repo
        self.validator = validator

    async def prepare(self, code: str | None, email: str, role: UserRole) -> Account | None:
        """Проверяет реферальную ссылку перед созданием или заменой аккаунта."""
        if code is None:
            return None

        inviter = await self.validator.require_inviter(code, email, role)
        await self.validator.ensure_new_user(email, inviter.id)
        return inviter

    async def execute(self, invited: Account, inviter: Account | None) -> None:
        """Привязывает созданный аккаунт к первоначальному пригласившему."""
        if inviter is None:
            return

        email = normalize_email(invited.email)
        referral = await self.repo.find_by_email(email)

        if referral is None:
            referral = Referral(
                inviter_id=inviter.id,
                invited_id=invited.id,
                invited_email=email,
            )
        else:
            referral.invited_id = invited.id

        await self.repo.add(referral)
