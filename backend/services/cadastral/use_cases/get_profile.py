"""Use case: чтение анкеты кадастрового инженера."""
from schemas.cadastral import CadastralProfileResponse
from services.cadastral.validators import CadastralValidator


class GetCadastralProfileUseCase:
    """Возвращает анкету исполнителя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: CadastralValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> CadastralProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.cadastral_profile is None:
            return CadastralProfileResponse()
        return CadastralProfileResponse.model_validate(expert.cadastral_profile)
