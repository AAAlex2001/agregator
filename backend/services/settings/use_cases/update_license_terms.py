"Use case: update license terms."
from models.account import Account
from schemas.settings import LicenseRentalKind, UpdateLicenseHolderRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateLicenseTermsUseCase:
    "Меняет условия предоставления лицензии (для роли LICENSE_HOLDER)."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateLicenseHolderRequest) -> Account:
        "Запускает основной сценарий use case."
        account = await self.validator.require_license_holder(user_id)
        holder = self.validator.require_license_holder_profile(account)
        holder.license_number = data.license_number
        holder.license_areas = data.license_areas
        holder.license_rental_kind = data.license_rental_kind.value
        holder.license_rental_percent = (
            data.license_rental_percent if data.license_rental_kind is LicenseRentalKind.PERCENT else None
        )
        holder.license_rental_fixed_amount = (
            data.license_rental_fixed_amount if data.license_rental_kind is LicenseRentalKind.FIXED else None
        )
        holder.mining_license_number = data.mining_license_number
        holder.lab_accreditation_number = data.lab_accreditation_number
        await self.repo.flush()
        return account
