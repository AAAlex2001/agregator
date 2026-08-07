"Use case: register license holder."
from models.account import Account, UserRole
from models.audit import LicenseHolderAuditProfile
from models.license_holder import LicenseHolder, LicenseRentalKind
from schemas.registration import LicenseHolderRegistration
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterLicenseHolderUseCase:
    "Создаёт аккаунт держателя разрешительных документов с профилем LicenseHolder."

    def __init__(self, repo: RegistrationRepository, validator: RegistrationValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        data: LicenseHolderRegistration,
        license_file_url: str | None,
        mining_license_file_url: str | None = None,
        sro_design_file_url: str | None = None,
        lab_accreditation_file_url: str | None = None,
    ) -> Account:
        "Запускает основной сценарий use case."
        self.validator.ensure_password_strong(data.password)
        self.validator.ensure_email_not_disposable(data.email)
        await self.repo.delete_unverified(data.email, UserRole.LICENSE_HOLDER)
        await self.validator.ensure_email_is_free(data.email, UserRole.LICENSE_HOLDER)
        await self.validator.ensure_phone_is_free(data.phone, UserRole.LICENSE_HOLDER)
        await self.validator.ensure_inn_is_free(data.inn, UserRole.LICENSE_HOLDER)

        account = Account(
            role=UserRole.LICENSE_HOLDER,
            email=data.email,
            email_verified=False,
            phone=data.phone,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            email_on_chat_message=False,
        )
        await self.repo.add(account)

        profile = LicenseHolder(
            account_id=account.id,
            license_number=data.license_number,
            license_file_url=license_file_url,
            license_areas=data.license_areas,
            license_rental_kind=(
                data.license_rental_kind.value if data.license_rental_kind is not None else None
            ),
            license_rental_percent=(
                data.license_rental_percent
                if data.license_rental_kind is LicenseRentalKind.PERCENT
                else None
            ),
            license_rental_fixed_amount=(
                data.license_rental_fixed_amount
                if data.license_rental_kind is LicenseRentalKind.FIXED
                else None
            ),
            mining_license_number=data.mining_license_number,
            mining_license_file_url=mining_license_file_url,
            sro_design_file_url=sro_design_file_url,
            lab_accreditation_number=data.lab_accreditation_number,
            lab_accreditation_file_url=lab_accreditation_file_url,
            email_on_order_updated=False,
            email_on_bidding_finished=False,
            email_on_labor_listing=True,
        )
        account.license_holder_profile = profile
        await self.repo.add(profile)

        if data.audit_profile is not None:
            await self.repo.add(
                LicenseHolderAuditProfile(
                    license_holder_id=profile.id,
                    **data.audit_profile.model_dump(),
                )
            )

        loaded = await self.repo.find_account(account.id)
        return loaded if loaded is not None else account
