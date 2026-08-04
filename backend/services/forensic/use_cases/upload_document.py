"""Use case: загрузка документа о доп. образовании в анкету судебного эксперта."""
from fastapi import HTTPException, UploadFile, status

from models.forensic import ExpertForensicProfile
from schemas.forensic import ForensicProfileResponse
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)
from services.forensic.repository import ForensicRepository
from services.forensic.validators import ForensicValidator


class UploadForensicDocumentUseCase:
    """Прикладывает диплом о доп. образовании или курсах, до десяти файлов."""

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

        existing = list(profile.documents or [])
        if len(existing) >= MAX_PROFILE_DOCUMENTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Можно загрузить не более {MAX_PROFILE_DOCUMENTS} документов",
            )

        saved = await save_direction_file(account.public_id, file)
        try:
            profile.documents = [*existing, saved]
            await self.repo.add(profile)
        except Exception:
            remove_direction_file(account.public_id, saved["url"])
            raise

        return ForensicProfileResponse.model_validate(profile)
