"""Условия участия в реферальной программе."""

from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.referral import Referral, ReferralStatus
from services.referrals.profile_policy import is_profile_complete
from services.referrals.repository import ReferralRepository


def normalize_email(email: str | None) -> str:
    """Убирает внешние пробелы email и приводит его к нижнему регистру."""
    return (email or "").strip().lower()


def is_active_expert(account: Account | None) -> bool:
    """Проверяет, может ли аккаунт участвовать как исполнитель."""
    if account is None:
        return False

    return (
        account.role == UserRole.EXPERT
        and account.is_active
        and account.email_verified
        and account.expert_profile is not None
    )


class ReferralValidator:
    """Проверяет условия без изменения данных."""

    def __init__(self, repo: ReferralRepository) -> None:
        """Создаёт валидатор реферальной программы."""
        self.repo = repo

    async def require_expert(self, user_id: int) -> Account:
        """Получает исполнителя, которому разрешён доступ к реферальному кабинету."""
        account = await self.repo.find_account(user_id)
        if account is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        if not is_active_expert(account):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно исполнителю с подтверждённой почтой",
            )
        return account

    async def require_inviter(self, code: str, email: str, role: UserRole) -> Account:
        """Проверяет ссылку, роль нового пользователя и запрет самоприглашения."""
        if role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Реферальная программа доступна только исполнителям",
            )

        inviter = await self.repo.find_inviter(code)
        if inviter is None or not is_active_expert(inviter):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Реферальная ссылка недействительна"
            )
        if normalize_email(inviter.email) == normalize_email(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Нельзя пригласить самого себя"
            )
        return inviter

    async def ensure_new_user(self, email: str, inviter_id: int) -> None:
        """Проверяет, что email ещё не участвовал и не занят существующим пользователем."""
        email = normalize_email(email)
        referral = await self.repo.find_by_email(email)
        self.ensure_same_pending_referral(referral, inviter_id)

        accounts = await self.repo.find_accounts_by_email(email)
        for account in accounts:
            if not self.is_registration_retry(account, referral):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Приглашать можно только новых пользователей",
                )

    @staticmethod
    def ensure_same_pending_referral(referral: Referral | None, inviter_id: int) -> None:
        """Проверяет, можно ли продолжить ранее созданное приглашение."""
        if referral is None:
            return
        if referral.status == ReferralStatus.PENDING and referral.inviter_id == inviter_id:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Этот email уже участвовал в реферальной программе",
        )

    @staticmethod
    def is_registration_retry(account: Account, referral: Referral | None) -> bool:
        """Проверяет, относится ли аккаунт к незавершённой регистрации по этой ссылке."""
        if referral is None:
            return False
        return (
            referral.invited_id == account.id
            and account.role == UserRole.EXPERT
            and not account.email_verified
        )

    async def can_reward(self, referral: Referral) -> bool:
        """Проверяет подтверждение исходной почты и заполненность приглашённого профиля."""
        if referral.invited_id is None:
            return False
        account = await self.repo.find_account(referral.invited_id)
        if account is None or not is_active_expert(account):
            return False
        if normalize_email(account.email) != referral.invited_email:
            return False
        return is_profile_complete(account)
