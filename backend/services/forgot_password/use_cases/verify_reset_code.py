"Use case: verify reset code."
from models.user import User
from services.forgot_password.validators import ForgotPasswordValidator
from services.verification import VerificationService


class VerifyResetCodeUseCase:
    "Проверяет, что код для пользователя валиден (без consume)."

    def __init__(self, validator: ForgotPasswordValidator, verification: VerificationService) -> None:
        self.validator = validator
        self.verification = verification

    async def execute(self, email: str | None, phone: str | None, code: str) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(email, phone)
        await self.verification.ensure_code_valid(user.id, code)
        return user
