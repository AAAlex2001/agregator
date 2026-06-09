"Use case: get profile."
from models.user import User
from services.settings.validators import SettingsValidator


class GetProfileUseCase:
    "Возвращает текущего пользователя или 404."

    def __init__(self, validator: SettingsValidator) -> None:
        self.validator = validator

    async def execute(self, user_id: int) -> User:
        "Запускает основной сценарий use case."
        return await self.validator.require_user(user_id)
