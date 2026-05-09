from models.user import User
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateEmailPreferencesUseCase:
    "Частичный патч флагов email-уведомлений."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, patch: dict) -> User:
        user = await self.validator.get_user_or_404(user_id)
        for field, value in patch.items():
            setattr(user, field, value)
        await self.repo.flush()
        return user
