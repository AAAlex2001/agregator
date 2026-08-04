"""Use case: замена диплома об образовании в анкете судебного эксперта."""
from fastapi import UploadFile

from models.forensic import ExpertForensicProfile
from schemas.forensic import ForensicProfileResponse
from services.direction_files import remove_direction_file, save_direction_file
from services.forensic.repository import ForensicRepository
from services.forensic.validators import ForensicValidator


class UploadForensicDiplomaUseCase:
    """Сохраняет новый диплом и удаляет прежний после успешной записи."""

    def __init__(self, repo: ForensicRepository, validator: ForensicValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> ForensicProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.forensic_profile
        if profile is None:
            profile = ExpertForensicProfile(expert_id=expert.id, documents=[])
            expert.forensic_profile = profile

        previous = profile.education_diploma
        saved = await save_direction_file(account.public_id, file)
        profile.education_diploma = saved

        try:
            await self.repo.add(profile)
        except Exception:
            remove_direction_file(account.public_id, saved["url"])
            raise

        if previous is not None:
            remove_direction_file(account.public_id, previous.get("url"))
        return ForensicProfileResponse.model_validate(profile)
