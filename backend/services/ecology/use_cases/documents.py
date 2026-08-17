"""Use cases: подтверждающие документы в анкете эколога."""
from fastapi import HTTPException, UploadFile, status

from models.ecology import ExpertEcologyProfile
from schemas.ecology import EcologyExpertProfileResponse
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)
from services.ecology.repository import EcologyRepository
from services.ecology.validators import EcologyValidator


class UploadEcologyDocumentUseCase:
    """Прикладывает документ к анкете эколога, до десяти файлов."""

    def __init__(self, repo: EcologyRepository, validator: EcologyValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> EcologyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.ecology_profile
        if profile is None:
            profile = ExpertEcologyProfile(expert_id=expert.id, documents=[])
            expert.ecology_profile = profile

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

        return EcologyExpertProfileResponse.model_validate(profile)


class DeleteEcologyDocumentUseCase:
    """Убирает документ из анкеты эколога и с диска."""

    def __init__(self, repo: EcologyRepository, validator: EcologyValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, url: str) -> EcologyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.ecology_profile
        existing = list(profile.documents or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        profile.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return EcologyExpertProfileResponse.model_validate(profile)
