from fastapi import BackgroundTasks

from models.user import User
from services.forgot_password.validators import ForgotPasswordValidator
from services.verification import VerificationService

RESET_CODE_SUBJECT = "Сброс пароля на Ресурс-Плюс"


class SendResetCodeUseCase:
    "Находит пользователя по email/phone и шлёт код в фоне."

    def __init__(self, validator: ForgotPasswordValidator, verification: VerificationService):
        self.validator = validator
        self.verification = verification

    async def execute(
        self,
        email: str | None,
        phone: str | None,
        background_tasks: BackgroundTasks,
    ) -> User:
        user = await self.validator.find_user(email, phone)
        if email:
            await self.verification.schedule_code_email(
                user.id, email, RESET_CODE_SUBJECT, background_tasks
            )
        return user
