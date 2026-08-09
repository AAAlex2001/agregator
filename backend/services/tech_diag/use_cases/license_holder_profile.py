"""Use cases: анкета лаборатории неразрушающего контроля."""
from models.tech_diag import LicenseHolderTechDiagProfile
from schemas.tech_diag import (
    TechDiagLicenseHolderProfileInput,
    TechDiagLicenseHolderProfileResponse,
)
from services.tech_diag.repository import TechDiagRepository
from services.tech_diag.validators import TechDiagValidator


class GetTechDiagLicenseHolderProfileUseCase:
    """Возвращает анкету лаборатории; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: TechDiagValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> TechDiagLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)
        if holder.tech_diag_profile is None:
            return TechDiagLicenseHolderProfileResponse()
        return TechDiagLicenseHolderProfileResponse.model_validate(holder.tech_diag_profile)


class SaveTechDiagLicenseHolderProfileUseCase:
    """Создаёт анкету лаборатории при первом сохранении и записывает поля формы."""

    def __init__(self, repo: TechDiagRepository, validator: TechDiagValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: TechDiagLicenseHolderProfileInput
    ) -> TechDiagLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.tech_diag_profile
        if profile is None:
            profile = LicenseHolderTechDiagProfile(license_holder_id=holder.id)
            holder.tech_diag_profile = profile

        profile.methods = data.methods
        profile.organization_city = data.organization_city

        await self.repo.add(profile)
        return TechDiagLicenseHolderProfileResponse.model_validate(profile)
