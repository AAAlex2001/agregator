from models.user import User
from services.company_card_storage import remove_company_card
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ClearCompanyCardUseCase:
    "Удаляет файл карточки предприятия лицензиата."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int) -> User:
        user = await self.validator.require_license_holder(user_id)
        previous_url = user.company_card_url
        user.company_card_url = None
        await self.repo.flush()
        if previous_url:
            remove_company_card(previous_url)
        return user
