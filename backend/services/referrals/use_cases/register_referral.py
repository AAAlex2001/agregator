"""Привязка нового исполнителя к приглашению при регистрации."""

from models.account import Account, UserRole
from models.referral import Referral, ReferralStatus
from services.referrals.emails import canonical_email
from services.referrals.repository import ReferralRepository
from services.referrals.validators import ReferralValidator


class RegisterReferralUseCase:
    """Сохраняет приглашение; недействительная ссылка не мешает регистрации."""

    def __init__(self, repo: ReferralRepository, validator: ReferralValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, invited: Account, code: str | None) -> None:
        """Продолжает ожидающее приглашение этого email или создаёт новое по ссылке."""
        if invited.role != UserRole.EXPERT or invited.email is None:
            return

        email = canonical_email(invited.email)
        referral = await self.repo.find_by_email(email)
        if referral is not None:
            if referral.status == ReferralStatus.PENDING:
                referral.invited_id = invited.id
                await self.repo.flush()
            return

        if code is None:
            return
        inviter = await self.validator.find_inviter(code, invited.email, invited.id)
        if inviter is None:
            return
        await self.repo.add(Referral(inviter_id=inviter.id, invited_id=invited.id, invited_email=email))
