"""Use cases: документы анкет проектирования — по группам у проектировщика и у члена СРО."""
from fastapi import HTTPException, UploadFile, status

from models.design import ExpertDesignProfile, LicenseHolderDesignProfile
from schemas.design import DesignExpertProfileResponse, DesignLicenseHolderProfileResponse
from services.design.repository import DesignRepository
from services.design.validators import DesignValidator
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)

EXPERT_DOCUMENT_GROUPS = {
    "education": "education_documents",
    "nok": "nok_documents",
    "nrs": "nrs_documents",
    "qualification": "qualification_documents",
    "rtn": "rtn_documents",
}

MAX_GROUP_DOCUMENTS = 5


def require_group_attribute(group: str) -> str:
    """Возвращает имя колонки документов по группе или бросает 400."""
    attribute = EXPERT_DOCUMENT_GROUPS.get(group)
    if attribute is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неизвестная группа документов",
        )
    return attribute


class UploadDesignDocumentUseCase:
    """Прикладывает документ к выбранной группе анкеты проектировщика, до пяти файлов."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, group: str, file: UploadFile
    ) -> DesignExpertProfileResponse:
        attribute = require_group_attribute(group)
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.design_profile
        if profile is None:
            profile = ExpertDesignProfile(
                expert_id=expert.id,
                education_documents=[],
                nok_documents=[],
                nrs_documents=[],
                qualification_documents=[],
                rtn_documents=[],
            )
            expert.design_profile = profile

        existing = list(getattr(profile, attribute) or [])
        if len(existing) >= MAX_GROUP_DOCUMENTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Можно загрузить не более {MAX_GROUP_DOCUMENTS} документов",
            )

        saved = await save_direction_file(account.public_id, file)
        try:
            setattr(profile, attribute, [*existing, saved])
            await self.repo.add(profile)
        except Exception:
            remove_direction_file(account.public_id, saved["url"])
            raise

        return DesignExpertProfileResponse.model_validate(profile)


class DeleteDesignDocumentUseCase:
    """Убирает документ из группы анкеты проектировщика и с диска."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, group: str, url: str) -> DesignExpertProfileResponse:
        attribute = require_group_attribute(group)
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.design_profile
        existing = list(getattr(profile, attribute) or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        setattr(profile, attribute, [item for item in existing if item.get("url") != url])
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return DesignExpertProfileResponse.model_validate(profile)


class UploadDesignHolderDocumentUseCase:
    """Прикладывает дополнительный документ к анкете члена СРО, до десяти файлов."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> DesignLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.design_profile
        if profile is None:
            profile = LicenseHolderDesignProfile(license_holder_id=holder.id, documents=[])
            holder.design_profile = profile

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

        return DesignLicenseHolderProfileResponse.model_validate(profile)


class DeleteDesignHolderDocumentUseCase:
    """Убирает дополнительный документ из анкеты члена СРО и с диска."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, url: str) -> DesignLicenseHolderProfileResponse:
        account = await self.validator.require_account(account_id)
        holder = self.validator.require_license_holder(account)

        profile = holder.design_profile
        existing = list(profile.documents or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        profile.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return DesignLicenseHolderProfileResponse.model_validate(profile)
