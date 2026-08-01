"Use case: удаление документа из анкеты направления."
from fastapi import HTTPException, status

from schemas.directions import DirectionDocument
from services.directions.document_storage import remove_direction_document
from services.directions.repository import DirectionsRepository
from services.directions.validators import DirectionsValidator


class DeleteDirectionDocumentUseCase:
    """Убирает документ из анкеты направления и с диска.

    Ссылка ищется среди документов текущего аккаунта — это единственная проверка
    владения файлом, хранилище её не делает.
    """

    def __init__(self, repo: DirectionsRepository, validator: DirectionsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, direction_key: str, url: str
    ) -> list[DirectionDocument]:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction(direction_key)
        account = await self.validator.require_account(account_id)
        form = self.validator.require_form(account, direction)
        self.validator.require_documents_support(form)
        profile = self.validator.require_role_profile(account)

        target = self.validator.documents_holder(profile, form)
        existing = list(target.documents or []) if target is not None else []
        if not any(item.get("url") == url for item in existing):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден",
            )

        target.documents = [item for item in existing if item.get("url") != url]
        await self.repo.add(target)
        remove_direction_document(account.public_id, url)

        return [DirectionDocument.model_validate(item) for item in target.documents]
