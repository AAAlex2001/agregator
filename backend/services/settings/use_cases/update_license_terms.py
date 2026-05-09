from models.user import User
from schemas.settings import LicenseRentalKind, UpdateLicenseHolderRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateLicenseTermsUseCase:
    "Меняет условия предоставления лицензии (для роли LICENSE_HOLDER)."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateLicenseHolderRequest) -> User:
        user = await self.validator.require_license_holder(user_id)
        user.license_number = data.license_number
        user.license_areas = data.license_areas
        user.license_rental_kind = data.license_rental_kind.value
        user.license_rental_percent = (
            data.license_rental_percent if data.license_rental_kind is LicenseRentalKind.PERCENT else None
        )
        user.license_rental_fixed_amount = (
            data.license_rental_fixed_amount if data.license_rental_kind is LicenseRentalKind.FIXED else None
        )
        await self.repo.flush()
        return user
