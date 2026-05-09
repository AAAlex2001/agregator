from models.user import User
from schemas.registration import UserRegistration
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterUserUseCase:
    "Создаёт обычного юзера (CUSTOMER/EXPERT) с email_verified=False."

    def __init__(self, repo: RegistrationRepository, validator: RegistrationValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, data: UserRegistration) -> User:
        self.validator.ensure_password_strong(data.password)
        self.validator.ensure_customer_has_company(data)
        self.validator.ensure_inn_format(data.inn)
        self.validator.ensure_company_matches_inn(data.inn, data.company_data)

        await self.validator.ensure_email_is_free(data.email, data.role)
        await self.validator.ensure_phone_is_free(data.phone, data.role)
        await self.validator.ensure_inn_is_free(data.inn, data.role)

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
        )
        await self.repo.add(user)
        return user
