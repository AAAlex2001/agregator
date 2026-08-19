"Use case: заменить файл выписки из реестра СРО изыскателей."
from fastapi import UploadFile

from models.account import Account
from services.license_holders import remove_regulatory_document_file, save_sro_survey_file
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class ReplaceSroSurveyFileUseCase:
    "Загружает новую выписку СРО изыскателей и удаляет предыдущую после успешной записи в БД."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> Account:
        "Заменяет файл атомарно: сначала пишем новый, потом БД, и только тогда удаляем старый."
        account = await self.validator.require_license_holder(user_id)
        holder = self.validator.require_license_holder_profile(account)
        owner_key = account.inn or account.public_id
        new_url = await save_sro_survey_file(owner_key, file)

        previous_url = holder.sro_survey_file_url
        holder.sro_survey_file_url = new_url
        try:
            await self.repo.flush()
        except Exception:
            remove_regulatory_document_file(new_url)
            raise

        if previous_url and previous_url != new_url:
            remove_regulatory_document_file(previous_url)
        return account
