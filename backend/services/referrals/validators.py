"""Условия участия в реферальной программе."""

from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.referral import Referral
from services.referrals.emails import canonical_email
from services.referrals.profile_policy import is_profile_complete
from services.referrals.repository import ReferralRepository


def is_active_expert(account: Account | None) -> bool:
    """Проверяет, может ли аккаунт участвовать как исполнитель."""
    return (
        account is not None
        and account.role == UserRole.EXPERT
        and account.is_active
        and account.email_verified
        and account.expert_profile is not None
    )


class ReferralValidator:
    """Проверяет условия без изменения данных."""

    def __init__(self, repo: ReferralRepository) -> None:
        self.repo = repo

    async def require_expert(self, user_id: int) -> Account:
        """Возвращает исполнителя, которому доступен реферальный кабинет."""
        account = await self.repo.find_account(user_id)
        if account is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        if not is_active_expert(account):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно исполнителю с подтверждённой почтой",
            )
        return account

    async def find_inviter(self, code: str, email: str, invited_id: int) -> Account | None:
        """Возвращает владельца ссылки, если он активен, а приглашённый — новый пользователь."""
        inviter = await self.repo.find_inviter(code)
        if inviter is None or not is_active_expert(inviter):
            return None
        if canonical_email(inviter.email) == canonical_email(email):
            return None
        if await self.repo.has_other_accounts(email, invited_id):
            return None
        return inviter

    async def can_reward(self, referral: Referral) -> bool:
        """Проверяет подтверждение исходной почты и заполненность приглашённого профиля."""
        if referral.invited_id is None:
            return False
        account = await self.repo.find_account(referral.invited_id)
        if account is None or not is_active_expert(account):
            return False
        if canonical_email(account.email) != canonical_email(referral.invited_email):
            return False
        return is_profile_complete(account)
