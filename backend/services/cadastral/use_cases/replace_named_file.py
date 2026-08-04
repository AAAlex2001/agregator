"""Use case: замена именованного файла анкеты — диплома или аттестата."""
from enum import Enum

from fastapi import UploadFile

from models.cadastral import ExpertCadastralProfile
from schemas.cadastral import CadastralProfileResponse
from services.cadastral.repository import CadastralRepository
from services.cadastral.validators import CadastralValidator
from services.direction_files import remove_direction_file, save_direction_file


class CadastralFileKind(str, Enum):
    """Какой из одиночных файлов анкеты заменяется."""
    DIPLOMA = "DIPLOMA"
    CERTIFICATE = "CERTIFICATE"


class ReplaceCadastralFileUseCase:
    """Сохраняет новый файл и удаляет прежний после успешной записи."""

    def __init__(self, repo: CadastralRepository, validator: CadastralValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, kind: CadastralFileKind, file: UploadFile
    ) -> CadastralProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.cadastral_profile
        if profile is None:
            profile = ExpertCadastralProfile(expert_id=expert.id, documents=[])
            expert.cadastral_profile = profile

        saved = await save_direction_file(account.public_id, file)
        if kind is CadastralFileKind.DIPLOMA:
            previous = profile.education_diploma
            profile.education_diploma = saved
        else:
            previous = profile.certificate_file
            profile.certificate_file = saved

        try:
            await self.repo.add(profile)
        except Exception:
            remove_direction_file(account.public_id, saved["url"])
            raise

        if previous is not None:
            remove_direction_file(account.public_id, previous.get("url"))
        return CadastralProfileResponse.model_validate(profile)
