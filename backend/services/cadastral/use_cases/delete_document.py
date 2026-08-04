"""Use case: удаление дополнительного документа из анкеты кадастрового инженера."""
from fastapi import HTTPException, status

from schemas.cadastral import CadastralProfileResponse
from services.cadastral.repository import CadastralRepository
from services.cadastral.validators import CadastralValidator
from services.direction_files import remove_direction_file


class DeleteCadastralDocumentUseCase:
    """Убирает документ из анкеты и с диска; чужие ссылки не проходят проверку владельца."""

    def __init__(self, repo: CadastralRepository, validator: CadastralValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, account_id: int, url: str) -> CadastralProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.cadastral_profile
        existing = list(profile.documents or []) if profile is not None else []
        if profile is None or not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        profile.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(profile)
        remove_direction_file(account.public_id, url)
        return CadastralProfileResponse.model_validate(profile)
