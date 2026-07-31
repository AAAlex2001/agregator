"Use case: mark notifications introduced."
from models.account import Account
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class MarkNotificationsIntroducedUseCase:
    "Помечает что пользователь увидел приветственную модалку про почтовые уведомления."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int) -> Account:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        user.notifications_introduced = True
        await self.repo.flush()
        return user
