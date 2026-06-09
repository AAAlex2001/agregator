"Use case: update personal data."
from models.user import User
from schemas.settings import UpdatePersonalDataRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdatePersonalDataUseCase:
    "Обновляет имя/фамилию/телефон/ИНН (без email — он меняется отдельным flow с подтверждением)."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdatePersonalDataRequest) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)

        if data.first_name is not None:
            user.first_name = data.first_name
        if data.last_name is not None:
            user.last_name = data.last_name
        if data.phone is not None:
            await self.validator.ensure_unique_phone(data.phone, user_id)
            user.phone = data.phone
        if data.inn is not None:
            await self.validator.ensure_unique_inn(data.inn, user_id)
            user.inn = data.inn

        await self.repo.flush()
        return user
