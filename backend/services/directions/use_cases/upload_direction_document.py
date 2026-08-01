"Use case: загрузка документа в анкету направления."
from fastapi import HTTPException, UploadFile, status

from schemas.directions import DirectionDocument
from services.directions.document_storage import (
    MAX_DIRECTION_DOCUMENTS,
    remove_direction_document,
    save_direction_document,
)
from services.directions.repository import DirectionsRepository
from services.directions.validators import DirectionsValidator


class UploadDirectionDocumentUseCase:
    """Прикладывает диплом, аттестат или свидетельство о курсах к анкете направления.

    Анкету создаёт при необходимости — документ можно приложить до её первого сохранения.
    """

    def __init__(self, repo: DirectionsRepository, validator: DirectionsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, direction_key: str, file: UploadFile
    ) -> list[DirectionDocument]:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction(direction_key)
        account = await self.validator.require_account(account_id)
        form = self.validator.require_form(account, direction)
        self.validator.require_documents_support(form)
        profile = self.validator.require_role_profile(account)

        target = self.validator.documents_holder(profile, form)
        if target is None:
            target = form.model()
            setattr(profile, form.owner_attribute, target)

        existing = list(target.documents or [])
        if len(existing) >= MAX_DIRECTION_DOCUMENTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Можно загрузить не более {MAX_DIRECTION_DOCUMENTS} документов",
            )

        document = await save_direction_document(account.public_id, file)
        try:
            target.documents = [*existing, document.model_dump()]
            await self.repo.add(target)
        except Exception:
            remove_direction_document(account.public_id, document.url)
            raise

        return [DirectionDocument.model_validate(item) for item in target.documents]
