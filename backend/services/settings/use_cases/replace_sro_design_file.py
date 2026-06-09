"Use case: заменить файл выписки из реестра СРО проектирования."
from fastapi import UploadFile

from models.user import User
from services.license_holders import remove_regulatory_document_file, save_sro_design_file
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ReplaceSroDesignFileUseCase:
    "Загружает новую выписку СРО проектирования и удаляет предыдущую после успешной записи в БД."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> User:
        "Заменяет файл атомарно: сначала пишем новый, потом БД, и только тогда удаляем старый."
        user = await self.validator.require_license_holder(user_id)
        owner_key = user.inn or user.public_id
        new_url = await save_sro_design_file(owner_key, file)

        previous_url = user.sro_design_file_url
        user.sro_design_file_url = new_url
        try:
            await self.repo.flush()
        except Exception:
            remove_regulatory_document_file(new_url)
            raise

        if previous_url and previous_url != new_url:
            remove_regulatory_document_file(previous_url)
        return user
