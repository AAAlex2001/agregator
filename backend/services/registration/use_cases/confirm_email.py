"Use case: confirm email."
from fastapi import HTTPException, status

from models.account import Account
from schemas.registration import UserRole
from services.registration.repository import RegistrationRepository
from services.verification import VerificationService


class ConfirmEmailUseCase:
    "Подтверждает email пользователя по коду из письма."

    def __init__(self, repo: RegistrationRepository, verification: VerificationService) -> None:
        self.repo = repo
        self.verification = verification

    async def execute(self, email: str, code: str, role: UserRole | None = None) -> Account:
        "Запускает основной сценарий use case."
        candidates = await self.repo.find_users_by_email(email, role)
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        # Если несколько — выбираем неподтверждённого; иначе первого.
        unverified = [u for u in candidates if not u.email_verified]
        user = unverified[0] if unverified else candidates[0]
        return await self.verification.confirm_email(user, code)
