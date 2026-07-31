"Use case: register guest customer."
from secrets import token_urlsafe

from models.account import Account, UserRole
from models.customer import Customer
from schemas.guest_order import GuestOrderCustomer
from schemas.registration import UserRole as SchemaUserRole
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterGuestCustomerUseCase:
    """Регистрирует заказчика по данным формы лендинга.

    Пароля пользователь не вводит: в базу кладётся случайный, войти по нему нельзя.
    Свой пароль заказчик задаёт в настройках или через восстановление по почте.
    """

    def __init__(self, repo: RegistrationRepository, validator: RegistrationValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, data: GuestOrderCustomer) -> Account:
        "Запускает основной сценарий use case."
        self.validator.ensure_email_not_disposable(data.email)

        await self.repo.delete_unverified(data.email, SchemaUserRole.CUSTOMER)
        await self.validator.ensure_email_is_free(data.email, SchemaUserRole.CUSTOMER)
        await self.validator.ensure_phone_is_free(data.phone, SchemaUserRole.CUSTOMER)

        account = Account(
            role=UserRole.CUSTOMER,
            email=data.email,
            email_verified=False,
            phone=data.phone,
            first_name=data.first_name,
            last_name=data.last_name,
            password=await hash_password(token_urlsafe(32)),
        )
        await self.repo.add(account)

        profile = Customer(account_id=account.id)
        account.customer_profile = profile
        await self.repo.add(profile)
        return account
