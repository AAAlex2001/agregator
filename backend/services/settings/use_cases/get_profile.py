"Use case: get profile."
from models.account import Account
from services.settings.validators import SettingsValidator


class GetProfileUseCase:
    "Возвращает текущего пользователя или 404."

    def __init__(self, validator: SettingsValidator) -> None:
        self.validator = validator

    async def execute(self, user_id: int) -> Account:
        "Запускает основной сценарий use case."
        return await self.validator.require_user(user_id)
