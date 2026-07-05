"Use case: register user."
from models.user import User, UserRole
from schemas.registration import UserRegistration
from services.experts.badge_codes import ALL_BADGE_CODES
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterUserUseCase:
    "Создаёт обычного юзера (CUSTOMER/EXPERT) с email_verified=False."

    def __init__(self, repo: RegistrationRepository, validator: RegistrationValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, data: UserRegistration) -> User:
        "Запускает основной сценарий use case."
        self.validator.ensure_password_strong(data.password)
        self.validator.ensure_email_not_disposable(data.email)
        self.validator.ensure_customer_has_company(data)
        self.validator.ensure_expert_attested(data)
        self.validator.ensure_inn_format(data.inn)
        self.validator.ensure_company_matches_inn(data.inn, data.company_data)

        await self.validator.ensure_email_is_free(data.email, data.role)
        await self.validator.ensure_phone_is_free(data.phone, data.role)

        user = User(
            role=data.role,
            phone=data.phone,
            email=data.email,
            email_verified=False,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            first_name=data.first_name,
            last_name=data.last_name,
            location_lat=data.location_lat,
            location_lng=data.location_lng,
            location_address=data.location_address,
            location_city=data.location_city,
            travels_to_other_regions=data.travels_to_other_regions,
        )
        if data.role.value == UserRole.EXPERT.value:
            user.notify_order_types = list(ALL_BADGE_CODES)
            user.expert_show_on_map = data.expert_show_on_map
            user.expert_map_fields = data.expert_map_fields
            if data.expert_certificates is not None:
                user.expert_certificates = [cert.model_dump() for cert in data.expert_certificates]
        await self.repo.add(user)
        return user
