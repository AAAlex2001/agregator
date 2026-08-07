"""Use cases: анкета инспекционного органа — держателя разрешительных документов."""
from models.audit import LicenseHolderAuditProfile
from schemas.audit import AuditLicenseHolderProfileInput, AuditLicenseHolderProfileResponse
from services.audit.repository import AuditRepository
from services.audit.validators import AuditValidator


class GetAuditLicenseHolderProfileUseCase:
    """Возвращает анкету инспекционного органа; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: AuditValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> AuditLicenseHolderProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)
        if holder.audit_profile is None:
            return AuditLicenseHolderProfileResponse()
        return AuditLicenseHolderProfileResponse.model_validate(holder.audit_profile)


class SaveAuditLicenseHolderProfileUseCase:
    """Создаёт анкету инспекционного органа при первом сохранении и записывает поля формы."""

    def __init__(self, repo: AuditRepository, validator: AuditValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: AuditLicenseHolderProfileInput
    ) -> AuditLicenseHolderProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.audit_profile
        if profile is None:
            profile = LicenseHolderAuditProfile(license_holder_id=holder.id)
            holder.audit_profile = profile

        profile.certificate_number = data.certificate_number
        profile.accreditation_areas = data.accreditation_areas

        await self.repo.add(profile)
        return AuditLicenseHolderProfileResponse.model_validate(profile)
