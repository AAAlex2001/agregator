"Use case: send reset code."
from fastapi import BackgroundTasks

from models.account import Account
from services.forgot_password.validators import ForgotPasswordValidator
from services.registration.disposable_email_domains import ensure_email_not_disposable
from services.verification import VerificationService

RESET_CODE_SUBJECT = "Сброс пароля на Ресурс-Плюс"


class SendResetCodeUseCase:
    "Находит пользователя по email/phone и шлёт код в фоне."

    def __init__(self, validator: ForgotPasswordValidator, verification: VerificationService) -> None:
        self.validator = validator
        self.verification = verification

    async def execute(
        self,
        email: str | None,
        phone: str | None,
        background_tasks: BackgroundTasks,
    ) -> Account:
        "Шлёт код на email найденного аккаунта — и при поиске по телефону тоже."
        ensure_email_not_disposable(email)
        user = await self.validator.require_user(email, phone)
        if user.email:
            await self.verification.schedule_code_email(
                user.id, user.email, RESET_CODE_SUBJECT, background_tasks
            )
        return user
