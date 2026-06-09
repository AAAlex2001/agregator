"Use case: confirm email change."
from fastapi import HTTPException, status

from models.user import User
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ConfirmEmailChangeUseCase:
    "Применяет смену email после ввода кода с нового адреса."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, code: str) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        request = await self.repo.find_email_change(user_id)

        if request is None or request.is_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Запрос на смену email не найден",
            )
        if request.expires_at < self.repo.now():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Срок действия кода истёк, запросите новый",
            )
        if request.code != code.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный код",
            )

        await self.validator.ensure_unique_email(request.new_email, user_id)

        user.email = request.new_email
        user.email_verified = True
        request.is_used = True
        await self.repo.flush()
        return user
