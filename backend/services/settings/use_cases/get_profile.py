from models.user import User
from services.settings.validators import SettingsValidator


class GetProfileUseCase:
    "Возвращает текущего пользователя или 404."

    def __init__(self, validator: SettingsValidator):
        self.validator = validator

    async def execute(self, user_id: int) -> User:
        return await self.validator.get_user_or_404(user_id)
