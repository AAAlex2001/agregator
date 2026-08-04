"""Use cases: анкета заказчика по аудиту СУПБ."""
from models.audit import CustomerAuditProfile
from schemas.audit import AuditCustomerProfileInput, AuditCustomerProfileResponse
from services.audit.repository import AuditRepository
from services.audit.validators import AuditValidator


class GetAuditCustomerProfileUseCase:
    """Возвращает анкету заказчика; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: AuditValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> AuditCustomerProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        customer = self.validator.require_customer(account)
        if customer.audit_profile is None:
            return AuditCustomerProfileResponse()
        return AuditCustomerProfileResponse.model_validate(customer.audit_profile)


class SaveAuditCustomerProfileUseCase:
    """Создаёт анкету заказчика при первом сохранении и записывает поля формы."""

    def __init__(self, repo: AuditRepository, validator: AuditValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: AuditCustomerProfileInput
    ) -> AuditCustomerProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        customer = self.validator.require_customer(account)

        profile = customer.audit_profile
        if profile is None:
            profile = CustomerAuditProfile(customer_id=customer.id)
            customer.audit_profile = profile

        profile.position = data.position
        profile.opo_license_number = data.opo_license_number

        await self.repo.add(profile)
        return AuditCustomerProfileResponse.model_validate(profile)
