"Use case: update expert certificates."
from models.account import Account
from schemas.settings import UpdateExpertCertificatesRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateExpertCertificatesUseCase:
    "Сохраняет список удостоверений эксперта (область + объект + категория)."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateExpertCertificatesRequest) -> Account:
        "Запускает основной сценарий use case."
        account = await self.validator.require_expert(user_id)
        expert = self.validator.require_expert_profile(account)
        expert.certificates = [cert.model_dump() for cert in data.certificates]
        expert.show_on_map = data.show_on_map
        expert.map_fields = data.map_fields
        await self.repo.flush()
        return account
