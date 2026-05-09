from fastapi import UploadFile

from models.user import User
from services.company_card_storage import remove_company_card, save_company_card
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ReplaceCompanyCardUseCase:
    "Загружает новую карточку предприятия для лицензиата."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> User:
        user = await self.validator.require_license_holder(user_id)
        owner_key = user.inn or user.public_id
        new_url = await save_company_card(owner_key, file)

        previous_url = user.company_card_url
        user.company_card_url = new_url
        try:
            await self.repo.flush()
        except Exception:
            remove_company_card(new_url)
            raise

        if previous_url and previous_url != new_url:
            remove_company_card(previous_url)
        return user
