"""Use case: сохранение анкеты судебного эксперта."""
from models.forensic import ExpertForensicProfile
from schemas.forensic import ForensicProfileInput, ForensicProfileResponse
from services.forensic.repository import ForensicRepository
from services.forensic.validators import ForensicValidator


class SaveForensicProfileUseCase:
    """Создаёт анкету при первом сохранении и записывает поля формы."""

    def __init__(self, repo: ForensicRepository, validator: ForensicValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: ForensicProfileInput
    ) -> ForensicProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.forensic_profile
        if profile is None:
            profile = ExpertForensicProfile(expert_id=expert.id, documents=[])
            expert.forensic_profile = profile

        profile.education = data.education
        profile.extra_education = data.extra_education
        profile.has_similar_experience = data.has_similar_experience
        profile.has_degree = data.has_degree
        profile.degree = data.degree
        profile.city = data.city
        profile.workplace_kind = data.workplace_kind
        profile.workplace_name = data.workplace_name

        await self.repo.add(profile)
        return ForensicProfileResponse.model_validate(profile)
