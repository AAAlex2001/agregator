"""Use cases: квалификационные удостоверения в анкете специалиста НК."""
from fastapi import HTTPException, UploadFile, status

from models.tech_diag import ExpertTechDiagProfile
from schemas.tech_diag import TechDiagExpertProfileResponse
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)
from services.tech_diag.repository import TechDiagRepository
from services.tech_diag.validators import TechDiagValidator


class UploadTechDiagDocumentUseCase:
    """Прикладывает удостоверение к анкете специалиста НК, до десяти файлов."""

    def __init__(self, repo: TechDiagRepository, validator: TechDiagValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> TechDiagExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.tech_diag_profile
        if profile is None:
            profile = ExpertTechDiagProfile(expert_id=expert.id, documents=[])
            expert.tech_diag_profile = profile

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

        return TechDiagExpertProfileResponse.model_validate(profile)


class DeleteTechDiagDocumentUseCase:
    """Убирает удостоверение из анкеты специалиста НК и с диска."""

    def __init__(self, repo: TechDiagRepository, validator: TechDiagValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, url: str) -> TechDiagExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.tech_diag_profile
        existing = list(profile.documents or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        profile.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return TechDiagExpertProfileResponse.model_validate(profile)
