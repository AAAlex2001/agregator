"Use case: update directions."
from fastapi import HTTPException, status

from models.account import Account
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateDirectionsUseCase:
    "Сохраняет отметки направлений заказчика или держателя разрешительных документов."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, directions: list[str]) -> Account:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        profile = user.customer_profile or user.license_holder_profile
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Отметки направлений доступны заказчику и держателю документов",
            )
        profile.directions = directions
        await self.repo.flush()
        return user
