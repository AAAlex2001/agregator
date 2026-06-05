"Use case: mark notifications introduced."
from models.user import User
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class MarkNotificationsIntroducedUseCase:
    "Помечает что пользователь увидел приветственную модалку про почтовые уведомления."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.get_user_or_404(user_id)
        user.notifications_introduced = True
        await self.repo.flush()
        return user
