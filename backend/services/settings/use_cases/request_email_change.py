"Use case: request email change."
from fastapi import BackgroundTasks, HTTPException, status

from models.email_change import EmailChangeRequest
from services.registration.disposable_email_domains import ensure_email_not_disposable
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator
from services.verification import deliver_code_email
from utils.code import generate_numeric_code
from utils.email_templates import render_email


class RequestEmailChangeUseCase:
    "Создаёт заявку на смену email и шлёт код на новый адрес в фоне."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        user_id: int,
        new_email: str,
        background_tasks: BackgroundTasks,
    ) -> None:
        "Запускает основной сценарий use case."
        user = await self.validator.get_user_or_404(user_id)
        normalized = new_email.strip().lower()

        if not normalized:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Укажите новый email",
            )
        ensure_email_not_disposable(normalized)
        if user.email and user.email.lower() == normalized:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже привязан к вашему аккаунту",
            )
        await self.validator.ensure_unique_email(normalized, user_id)

        await self.repo.delete_email_changes(user_id)
        code = generate_numeric_code()
        await self.repo.add_email_change(
            EmailChangeRequest(user_id=user_id, new_email=normalized, code=code)
        )

        rendered = render_email(
            name="verification_code",
            subject="Подтверждение нового email на Ресурс-Плюс",
            context={
                "heading": "Подтверждение нового email",
                "intro": "Вы запросили смену email. Введите этот код в окне подтверждения:",
                "code": code,
                "expire_minutes": 15,
            },
        )
        background_tasks.add_task(
            deliver_code_email,
            normalized,
            rendered.subject,
            rendered.text,
            rendered.html,
        )
