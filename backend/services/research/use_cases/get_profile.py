"""Use case: чтение анкеты исполнителя НИР."""
from schemas.research import ResearchProfileResponse
from services.research.validators import ResearchValidator


class GetResearchProfileUseCase:
    """Возвращает анкету исполнителя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: ResearchValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> ResearchProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.research_profile is None:
            return ResearchProfileResponse()
        return ResearchProfileResponse.model_validate(expert.research_profile)
