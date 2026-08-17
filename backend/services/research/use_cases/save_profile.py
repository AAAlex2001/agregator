"""Use case: сохранение анкеты исполнителя НИР."""
from models.research import ExpertResearchProfile
from schemas.research import ResearchProfileInput, ResearchProfileResponse
from services.research.repository import ResearchRepository
from services.research.validators import ResearchValidator


class SaveResearchProfileUseCase:
    """Создаёт анкету при первом сохранении и записывает поля формы."""

    def __init__(self, repo: ResearchRepository, validator: ResearchValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: ResearchProfileInput
    ) -> ResearchProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.research_profile
        if profile is None:
            profile = ExpertResearchProfile(expert_id=expert.id)
            expert.research_profile = profile

        profile.academic_degree = data.academic_degree
        profile.science_branches = data.science_branches
        profile.academic_title = data.academic_title
        profile.research_field = data.research_field

        await self.repo.add(profile)
        return ResearchProfileResponse.model_validate(profile)
