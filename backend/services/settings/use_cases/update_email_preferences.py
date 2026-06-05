"Use case: update email preferences."
from typing import Any

from models.user import User
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateEmailPreferencesUseCase:
    "Частичный патч флагов email-уведомлений."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, patch: dict[str, Any]) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.get_user_or_404(user_id)
        for field, value in patch.items():
            setattr(user, field, value)
        await self.repo.flush()
        return user
