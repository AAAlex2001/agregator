"Use case: update expert location."
from models.user import User
from schemas.settings import UpdateExpertLocationRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateExpertLocationUseCase:
    "Сохраняет место базирования эксперта и готовность к выездам в другие регионы."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateExpertLocationRequest) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        user.location_lat = data.location_lat
        user.location_lng = data.location_lng
        user.location_address = data.location_address
        user.location_city = data.location_city
        user.travels_to_other_regions = data.travels_to_other_regions
        await self.repo.flush()
        return user
