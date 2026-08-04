"""Use case: сохранение анкеты кадастрового инженера."""
from models.cadastral import ExpertCadastralProfile
from schemas.cadastral import CadastralProfileInput, CadastralProfileResponse
from services.cadastral.repository import CadastralRepository
from services.cadastral.validators import CadastralValidator


class SaveCadastralProfileUseCase:
    """Создаёт анкету при первом сохранении и записывает поля формы."""

    def __init__(self, repo: CadastralRepository, validator: CadastralValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: CadastralProfileInput
    ) -> CadastralProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.cadastral_profile
        if profile is None:
            profile = ExpertCadastralProfile(expert_id=expert.id, documents=[])
            expert.cadastral_profile = profile

        profile.education = data.education
        profile.registry_joined_at = data.registry_joined_at
        profile.certificate_number = data.certificate_number
        profile.registry_number = data.registry_number
        profile.has_equipment = data.has_equipment
        profile.city = data.city
        profile.workplace = data.workplace

        await self.repo.add(profile)
        return CadastralProfileResponse.model_validate(profile)
