"""Use case: чтение анкеты исполнителя лабораторных исследований."""
from schemas.laboratory import LaboratoryProfileResponse
from services.laboratory.validators import LaboratoryValidator


class GetLaboratoryProfileUseCase:
    """Возвращает анкету исполнителя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: LaboratoryValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> LaboratoryProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.laboratory_profile is None:
            return LaboratoryProfileResponse()
        return LaboratoryProfileResponse.model_validate(expert.laboratory_profile)
