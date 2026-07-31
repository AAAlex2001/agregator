"Use case: чтение профиля направления исполнителя."
from pydantic import BaseModel

from services.directions.validators import DirectionsValidator


class GetDirectionProfileUseCase:
    "Возвращает профиль направления или пустую анкету с дефолтами."

    def __init__(self, validator: DirectionsValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int, direction_key: str) -> BaseModel:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction_with_profile(direction_key)
        expert = await self.validator.require_expert(account_id)
        profile = getattr(expert, direction.profile_attribute)
        if profile is None:
            return direction.profile_response_schema()
        return direction.profile_response_schema.model_validate(profile)
