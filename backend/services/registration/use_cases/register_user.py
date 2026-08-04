"Use case: register user."
from datetime import UTC, datetime

from models.account import Account, UserRole
from models.customer import Customer
from models.expert import CONTACT_DISCLOSURE_CONSENT_VERSION, Expert
from schemas.registration import UserRegistration
from services.contact_deals.crypto import ContactDealCipher
from services.order_notification_types import ALL_ORDER_NOTIFICATION_TYPES
from services.registration.direction_profiles import build_direction_profiles
from services.registration.repository import RegistrationRepository
from services.registration.validators import RegistrationValidator
from utils.passwords import hash_password


class RegisterUserUseCase:
    """Создаёт аккаунт (CUSTOMER/EXPERT) с профилем роли и анкетами выбранных направлений.

    Профиль роли хранит общее для роли: контакты исполнителя, его локацию и продажу
    контактов. Всё, что относится к конкретному направлению, кладут анкеты из реестра.
    """

    def __init__(
        self,
        repo: RegistrationRepository,
        validator: RegistrationValidator,
        cipher: ContactDealCipher | None = None,
    ) -> None:
        self.repo = repo
        self.validator = validator
        self.cipher = cipher

    async def execute(self, data: UserRegistration) -> Account:
        "Запускает основной сценарий use case."
        self.validator.ensure_password_strong(data.password)
        self.validator.ensure_email_not_disposable(data.email)
        self.validator.ensure_customer_has_company(data)
        self.validator.ensure_inn_format(data.inn)
        self.validator.ensure_company_matches_inn(data.inn, data.company_data)

        await self.repo.delete_unverified(data.email, data.role)
        await self.validator.ensure_email_is_free(data.email, data.role)
        await self.validator.ensure_phone_is_free(data.phone, data.role)

        account = Account(
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
        await self.repo.add(account)

        if data.role.value == UserRole.EXPERT.value:
            profile = self.build_expert_profile(account, data)
            account.expert_profile = profile
        else:
            profile = Customer(account_id=account.id)
            account.customer_profile = profile
        await self.repo.add(profile)

        for entity in build_direction_profiles(account, data):
            await self.repo.add(entity)
        return account

    def build_expert_profile(self, account: Account, data: UserRegistration) -> Expert:
        "Собирает профиль исполнителя: место работы на карте и условия продажи контактов."
        profile = Expert(
            account_id=account.id,
            location_lat=data.location_lat,
            location_lng=data.location_lng,
            location_address=data.location_address,
            location_city=data.location_city,
            travels_to_other_regions=data.travels_to_other_regions,
            show_on_map=data.show_on_map,
            map_fields=data.map_fields,
            notify_order_types=list(ALL_ORDER_NOTIFICATION_TYPES),
        )
        if not data.contact_sales_enabled:
            return profile
        if self.cipher is None:
            raise RuntimeError("Contact deal cipher is required")
        profile.contact_sales_enabled = True
        profile.contact_price_kopecks = (data.contact_price_rubles or 0) * 100
        profile.contact_payment_details_encrypted = self.cipher.encrypt_text(
            (data.contact_payment_details or "").strip()
        )
        profile.contact_disclosure_consent_at = datetime.now(UTC)
        profile.contact_disclosure_consent_version = CONTACT_DISCLOSURE_CONSENT_VERSION
        return profile
