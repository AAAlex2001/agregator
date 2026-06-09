"Use case: заменить файл лицензии на маркшейдерские работы."
from fastapi import UploadFile

from models.user import User
from services.license_holders import remove_regulatory_document_file, save_mining_license_file
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ReplaceMiningLicenseFileUseCase:
    "Загружает новый файл лицензии маркшейдера и удаляет предыдущий после успешной записи в БД."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> User:
        "Заменяет файл атомарно: сначала пишем новый, потом БД, и только тогда удаляем старый."
        user = await self.validator.require_license_holder(user_id)
        owner_key = user.inn or user.public_id
        new_url = await save_mining_license_file(owner_key, file)

        previous_url = user.mining_license_file_url
        user.mining_license_file_url = new_url
        try:
            await self.repo.flush()
        except Exception:
            remove_regulatory_document_file(new_url)
            raise

        if previous_url and previous_url != new_url:
            remove_regulatory_document_file(previous_url)
        return user
