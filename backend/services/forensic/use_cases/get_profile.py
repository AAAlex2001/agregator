"""Use case: чтение анкеты судебного эксперта."""
from schemas.forensic import ForensicProfileResponse
from services.forensic.validators import ForensicValidator


class GetForensicProfileUseCase:
    """Возвращает анкету исполнителя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: ForensicValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> ForensicProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.forensic_profile is None:
            return ForensicProfileResponse()
        return ForensicProfileResponse.model_validate(expert.forensic_profile)
