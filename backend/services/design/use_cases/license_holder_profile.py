"""Use cases: анкета держателя — члена СРО проектировщиков."""
from models.design import LicenseHolderDesignProfile
from schemas.design import (
    DesignLicenseHolderProfileInput,
    DesignLicenseHolderProfileResponse,
)
from services.design.repository import DesignRepository
from services.design.validators import DesignValidator


class GetDesignLicenseHolderProfileUseCase:
    """Возвращает анкету члена СРО; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: DesignValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> DesignLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)
        if holder.design_profile is None:
            return DesignLicenseHolderProfileResponse()
        return DesignLicenseHolderProfileResponse.model_validate(holder.design_profile)


class SaveDesignLicenseHolderProfileUseCase:
    """Создаёт анкету члена СРО при первом сохранении и записывает поля формы."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: DesignLicenseHolderProfileInput
    ) -> DesignLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.design_profile
        if profile is None:
            profile = LicenseHolderDesignProfile(license_holder_id=holder.id, documents=[])
            holder.design_profile = profile

        profile.sro_name = data.sro_name
        profile.sro_registry_number = data.sro_registry_number
        profile.hazardous_objects_right = data.hazardous_objects_right
        profile.nuclear_objects_right = data.nuclear_objects_right
        profile.liability_level = data.liability_level
        profile.pricing_kind = data.pricing_kind
        profile.pricing_percent = data.pricing_percent
        profile.pricing_fixed_amount = data.pricing_fixed_amount

        await self.repo.add(profile)
        return DesignLicenseHolderProfileResponse.model_validate(profile)
