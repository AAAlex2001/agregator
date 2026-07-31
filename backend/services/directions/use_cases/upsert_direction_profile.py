"Use case: создание или обновление профиля направления исполнителя."
from pydantic import BaseModel

from services.directions.repository import DirectionsRepository
from services.directions.validators import DirectionsValidator


class UpsertDirectionProfileUseCase:
    "Пишет анкету направления: поля схемы совпадают с колонками модели."

    def __init__(self, repo: DirectionsRepository, validator: DirectionsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, direction_key: str, payload: BaseModel) -> BaseModel:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction_with_profile(direction_key)
        expert = await self.validator.require_expert(account_id)
        data = direction.profile_input_schema.model_validate(payload.model_dump()).model_dump()
        data["documents"] = [dict(document) for document in data["documents"]]

        profile = getattr(expert, direction.profile_attribute)
        if profile is None:
            profile = direction.profile_model(expert_id=expert.id, **data)
        else:
            for field, value in data.items():
                setattr(profile, field, value)
        await self.repo.add(profile)
        return direction.profile_response_schema.model_validate(profile)
