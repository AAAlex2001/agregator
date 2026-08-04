"""Use case: сохранение анкеты исполнителя лабораторных исследований."""
from models.laboratory import ExpertLaboratoryProfile
from schemas.laboratory import LaboratoryProfileInput, LaboratoryProfileResponse
from services.laboratory.repository import LaboratoryRepository
from services.laboratory.validators import LaboratoryValidator


class SaveLaboratoryProfileUseCase:
    """Создаёт анкету при первом сохранении и записывает поля формы."""

    def __init__(self, repo: LaboratoryRepository, validator: LaboratoryValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: LaboratoryProfileInput
    ) -> LaboratoryProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.laboratory_profile
        if profile is None:
            profile = ExpertLaboratoryProfile(expert_id=expert.id)
            expert.laboratory_profile = profile

        profile.accreditation_area = data.accreditation_area
        profile.comment = data.comment

        await self.repo.add(profile)
        return LaboratoryProfileResponse.model_validate(profile)
