"Use case: confirm email."

from fastapi import HTTPException, status

from models.account import Account, UserRole
from services.referrals import RewardReferralUseCase
from services.registration.repository import RegistrationRepository
from services.verification import VerificationService


class ConfirmEmailUseCase:
    "Подтверждает email пользователя по коду из письма."

    def __init__(
        self,
        repo: RegistrationRepository,
        verification: VerificationService,
        referrals: RewardReferralUseCase,
    ) -> None:
        """Создаёт сценарий подтверждения почты с проверкой реферального начисления."""
        self.repo = repo
        self.verification = verification
        self.referrals = referrals

    async def execute(self, email: str, code: str, role: UserRole | None = None) -> Account:
        """Подтверждает почту аккаунта по коду и начисляет бонус при выполнении условий."""
        candidates = await self.repo.find_users_by_email(email, role)
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        unverified = [u for u in candidates if not u.email_verified]
        user = unverified[0] if unverified else candidates[0]
        user = await self.verification.confirm_email(user, code)
        await self.referrals.execute(user.id)
        return user
