"""Use cases: анкета держателя — члена СРО изыскателей."""
from models.survey import LicenseHolderSurveyProfile
from schemas.survey import (
    SurveyLicenseHolderProfileInput,
    SurveyLicenseHolderProfileResponse,
)
from services.survey.repository import SurveyRepository
from services.survey.validators import SurveyValidator


class GetSurveyLicenseHolderProfileUseCase:
    """Возвращает анкету члена СРО; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: SurveyValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> SurveyLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)
        if holder.survey_profile is None:
            return SurveyLicenseHolderProfileResponse()
        return SurveyLicenseHolderProfileResponse.model_validate(holder.survey_profile)


class SaveSurveyLicenseHolderProfileUseCase:
    """Создаёт анкету члена СРО при первом сохранении и записывает поля формы."""

    def __init__(self, repo: SurveyRepository, validator: SurveyValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: SurveyLicenseHolderProfileInput
    ) -> SurveyLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.survey_profile
        if profile is None:
            profile = LicenseHolderSurveyProfile(license_holder_id=holder.id, documents=[])
            holder.survey_profile = profile

        profile.sro_name = data.sro_name
        profile.sro_registry_number = data.sro_registry_number
        profile.hazardous_objects_right = data.hazardous_objects_right
        profile.nuclear_objects_right = data.nuclear_objects_right
        profile.liability_level = data.liability_level
        profile.pricing_kind = data.pricing_kind
        profile.pricing_percent = data.pricing_percent
        profile.pricing_fixed_amount = data.pricing_fixed_amount

        await self.repo.add(profile)
        return SurveyLicenseHolderProfileResponse.model_validate(profile)
