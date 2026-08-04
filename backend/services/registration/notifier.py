"Сервисный модуль: notifier."
from fastapi import BackgroundTasks

from models.account import Account
from services.verification import VerificationService

EMAIL_CONFIRMATION_SUBJECT = "Подтверждение почты на Ресурс-Плюс"


class RegistrationNotifier:
    "Тонкая обёртка над VerificationService для отправки кода подтверждения email."

    def __init__(self, verification: VerificationService) -> None:
        self.verification = verification

    async def schedule_confirmation_email(self, user: Account, background_tasks: BackgroundTasks) -> None:
        "Публичный метод сервисного слоя."
        if not user.email:
            return
        await self.verification.schedule_code_email(
            user.id,
            user.email,
            EMAIL_CONFIRMATION_SUBJECT,
            background_tasks,
        )
