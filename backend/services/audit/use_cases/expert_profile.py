"""Use cases: анкета исполнителя по аудиту СУПБ."""
from models.audit import ExpertAuditProfile
from schemas.audit import AuditExpertProfileInput, AuditExpertProfileResponse
from services.audit.repository import AuditRepository
from services.audit.validators import AuditValidator


class GetAuditExpertProfileUseCase:
    """Возвращает анкету исполнителя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: AuditValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> AuditExpertProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.audit_profile is None:
            return AuditExpertProfileResponse()
        return AuditExpertProfileResponse.model_validate(expert.audit_profile)


class SaveAuditExpertProfileUseCase:
    """Создаёт анкету исполнителя при первом сохранении и записывает поля формы."""

    def __init__(self, repo: AuditRepository, validator: AuditValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: AuditExpertProfileInput
    ) -> AuditExpertProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.audit_profile
        if profile is None:
            profile = ExpertAuditProfile(expert_id=expert.id, documents=[])
            expert.audit_profile = profile

        profile.participant_kind = data.participant_kind
        profile.industrial_safety_areas = data.industrial_safety_areas
        profile.expert_attestation_areas = data.expert_attestation_areas
        profile.audit_qualifications = data.audit_qualifications
        profile.full_name = data.full_name
        profile.short_name = data.short_name
        profile.inn = data.inn
        profile.certificate_number = data.certificate_number
        profile.accreditation_areas = data.accreditation_areas

        await self.repo.add(profile)
        return AuditExpertProfileResponse.model_validate(profile)
