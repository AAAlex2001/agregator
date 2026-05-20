from models.user import User, UserRole as ModelUserRole
from schemas.registration import LicenseHolderRegistration, LicenseRentalKind, UserRole
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterLicenseHolderUseCase:
    "Создаёт держателя лицензии."

    def __init__(self, repo: RegistrationRepository, validator: RegistrationValidator):
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        data: LicenseHolderRegistration,
        license_file_url: str | None,
    ) -> User:
        self.validator.ensure_password_strong(data.password)
        self.validator.ensure_email_not_disposable(data.email)
        await self.validator.ensure_email_is_free(data.email, UserRole.LICENSE_HOLDER)
        await self.validator.ensure_phone_is_free(data.phone, UserRole.LICENSE_HOLDER)
        await self.validator.ensure_inn_is_free(data.inn, UserRole.LICENSE_HOLDER)

        user = User(
            role=ModelUserRole.LICENSE_HOLDER,
            email=data.email,
            email_verified=False,
            phone=data.phone,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            license_number=data.license_number,
            license_file_url=license_file_url,
            license_areas=data.license_areas,
            license_rental_kind=data.license_rental_kind.value,
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
            email_on_response_created=False,
            email_on_response_updated=False,
            email_on_expert_rejected=False,
            email_on_new_order=False,
            email_on_order_updated=False,
            email_on_bidding_finished=False,
            email_on_chat_message=False,
            email_on_question_asked=False,
            email_on_question_answered=False,
        )
        await self.repo.add(user)
        return user
