"""Use cases: анкета эколога."""
from models.ecology import ExpertEcologyProfile
from schemas.ecology import EcologyExpertProfileInput, EcologyExpertProfileResponse
from services.ecology.repository import EcologyRepository
from services.ecology.validators import EcologyValidator


class GetEcologyExpertProfileUseCase:
    """Отдаёт анкету эколога; если её ещё нет — пустую."""

    def __init__(self, validator: EcologyValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> EcologyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        profile = expert.ecology_profile
        if profile is None:
            return EcologyExpertProfileResponse()
        return EcologyExpertProfileResponse.model_validate(profile)


class SaveEcologyExpertProfileUseCase:
    """Сохраняет анкету эколога, создавая её при первом обращении."""

    def __init__(self, repo: EcologyRepository, validator: EcologyValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, data: EcologyExpertProfileInput) -> EcologyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.ecology_profile
        if profile is None:
            profile = ExpertEcologyProfile(expert_id=expert.id, documents=[])
            expert.ecology_profile = profile

        profile.work_types = data.work_types
        profile.practical_skills = data.practical_skills
        await self.repo.add(profile)
        return EcologyExpertProfileResponse.model_validate(profile)
