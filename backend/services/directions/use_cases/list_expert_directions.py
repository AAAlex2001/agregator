"Use case: список направлений исполнителя с признаком заполненности профиля."
from schemas.directions import DirectionSummary
from services.directions.registry import DIRECTIONS
from services.directions.validators import DirectionsValidator


class ListExpertDirectionsUseCase:
    "Отдаёт все направления реестра и отмечает, какие профили заполнены."

    def __init__(self, validator: DirectionsValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> list[DirectionSummary]:
        "Запускает основной сценарий use case."
        expert = await self.validator.require_expert(account_id)
        return [
            DirectionSummary(
                key=direction.key,
                title=direction.title,
                profile_filled=getattr(expert, direction.profile_attribute) is not None,
            )
            for direction in DIRECTIONS
        ]
