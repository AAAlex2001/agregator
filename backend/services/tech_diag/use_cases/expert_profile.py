"""Use cases: анкета специалиста НК (дефектоскописта)."""
from models.tech_diag import ExpertTechDiagProfile
from schemas.tech_diag import TechDiagExpertProfileInput, TechDiagExpertProfileResponse
from services.tech_diag.repository import TechDiagRepository
from services.tech_diag.validators import TechDiagValidator


class GetTechDiagExpertProfileUseCase:
    """Возвращает анкету специалиста НК; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: TechDiagValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> TechDiagExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.tech_diag_profile is None:
            return TechDiagExpertProfileResponse()
        return TechDiagExpertProfileResponse.model_validate(expert.tech_diag_profile)


class SaveTechDiagExpertProfileUseCase:
    """Создаёт анкету специалиста НК при первом сохранении и записывает поля формы."""

    def __init__(self, repo: TechDiagRepository, validator: TechDiagValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: TechDiagExpertProfileInput
    ) -> TechDiagExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.tech_diag_profile
        if profile is None:
            profile = ExpertTechDiagProfile(expert_id=expert.id, documents=[])
            expert.tech_diag_profile = profile

        profile.qualification_certificates = data.qualification_certificates
        profile.methods = data.methods
        profile.control_objects = data.control_objects

        await self.repo.add(profile)
        return TechDiagExpertProfileResponse.model_validate(profile)
