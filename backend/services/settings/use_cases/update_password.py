"Use case: update password."
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator
from utils.passwords import hash_password


class UpdatePasswordUseCase:
    "Меняет пароль пользователя на новый."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, new_password: str) -> None:
        "Запускает основной сценарий use case."
        user = await self.validator.get_user_or_404(user_id)
        user.password = await hash_password(new_password)
        await self.repo.flush()
