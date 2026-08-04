"""Use case: загрузка дополнительного документа в анкету кадастрового инженера."""
from fastapi import HTTPException, UploadFile, status

from models.cadastral import ExpertCadastralProfile
from schemas.cadastral import CadastralProfileResponse
from services.cadastral.repository import CadastralRepository
from services.cadastral.validators import CadastralValidator
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)


class UploadCadastralDocumentUseCase:
    """Прикладывает дополнительный диплом или свидетельство о курсах, до десяти файлов."""

    def __init__(self, repo: CadastralRepository, validator: CadastralValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> CadastralProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.cadastral_profile
        if profile is None:
            profile = ExpertCadastralProfile(expert_id=expert.id, documents=[])
            expert.cadastral_profile = profile

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

        return CadastralProfileResponse.model_validate(profile)
