"""Use cases: документы анкеты аудитора и файлы заявки на аудит."""
from fastapi import HTTPException, UploadFile, status

from models.audit import ExpertAuditProfile
from schemas.audit import AuditExpertProfileResponse, AuditFile
from services.audit.repository import AuditRepository
from services.audit.validators import AuditValidator
from services.direction_files import (
    MAX_PROFILE_DOCUMENTS,
    remove_direction_file,
    save_direction_file,
)


class UploadAuditDocumentUseCase:
    """Прикладывает документ к анкете аудитора, до десяти файлов."""

    def __init__(self, repo: AuditRepository, validator: AuditValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> AuditExpertProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.audit_profile
        if profile is None:
            profile = ExpertAuditProfile(expert_id=expert.id, documents=[])
            expert.audit_profile = profile

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

        return AuditExpertProfileResponse.model_validate(profile)


class DeleteAuditDocumentUseCase:
    """Убирает документ из анкеты аудитора и с диска."""

    def __init__(self, repo: AuditRepository, validator: AuditValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, url: str) -> AuditExpertProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.audit_profile
        existing = list(profile.documents or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        profile.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return AuditExpertProfileResponse.model_validate(profile)


class UploadAuditOrderFileUseCase:
    """Сохраняет файл заявки на аудит: СТО или свидетельство о регистрации ОПО.

    Файл кладётся в личный каталог заказчика до создания заявки; ссылка возвращается
    форме и попадает в поля sto_file или registration_certificate.
    """

    def __init__(self, validator: AuditValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int, file: UploadFile) -> AuditFile:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        self.validator.require_customer(account)
        saved = await save_direction_file(account.public_id, file)
        return AuditFile(name=saved["name"], url=saved["url"])
