"Use case: update expert location."
from models.account import Account
from schemas.settings import UpdateExpertLocationRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateExpertLocationUseCase:
    "Сохраняет присутствие исполнителя на карте: место, выезды и состав метки."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateExpertLocationRequest) -> Account:
        "Запускает основной сценарий use case."
        account = await self.validator.require_expert(user_id)
        expert = self.validator.require_expert_profile(account)
        expert.location_lat = data.location_lat
        expert.location_lng = data.location_lng
        expert.location_address = data.location_address
        expert.location_city = data.location_city
        expert.travels_to_other_regions = data.travels_to_other_regions
        expert.show_on_map = data.show_on_map
        expert.map_fields = data.map_fields
        await self.repo.flush()
        return account
