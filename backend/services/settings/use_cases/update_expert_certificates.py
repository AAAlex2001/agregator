"Use case: update expert certificates."
from models.user import User
from schemas.settings import UpdateExpertCertificatesRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateExpertCertificatesUseCase:
    "Сохраняет список удостоверений эксперта (область + объект + категория)."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, data: UpdateExpertCertificatesRequest) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        user.expert_certificates = [cert.model_dump() for cert in data.certificates]
        user.expert_show_on_map = data.show_on_map
        user.expert_map_fields = data.map_fields
        await self.repo.flush()
        return user
