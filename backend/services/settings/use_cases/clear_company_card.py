"Use case: clear company card."
from models.account import Account
from services.company_card_storage import remove_company_card
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ClearCompanyCardUseCase:
    "Удаляет файл карточки предприятия лицензиата."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int) -> Account:
        "Запускает основной сценарий use case."
        account = await self.validator.require_license_holder(user_id)
        holder = self.validator.require_license_holder_profile(account)
        previous_url = holder.company_card_url
        holder.company_card_url = None
        await self.repo.flush()
        if previous_url:
            remove_company_card(previous_url)
        return account
