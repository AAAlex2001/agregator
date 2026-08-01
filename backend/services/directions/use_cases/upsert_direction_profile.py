"Use case: сохранение анкеты направления."
from typing import Any

from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError

from services.directions.profile_writer import clean_payload, write
from services.directions.registry import RoleForm
from services.directions.repository import DirectionsRepository
from services.directions.validators import DirectionsValidator


class UpsertDirectionProfileUseCase:
    "Пишет анкету направления: в отдельную таблицу или в поля профиля роли."

    def __init__(self, repo: DirectionsRepository, validator: DirectionsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, direction_key: str, payload: dict[str, Any]
    ) -> BaseModel:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction(direction_key)
        account = await self.validator.require_account(account_id)
        form = self.validator.require_form(account, direction)
        profile = self.validator.require_role_profile(account)

        target = write(profile, form, self.validate(form, payload))
        await self.repo.add(target)
        return form.response_schema.model_validate(target)

    @staticmethod
    def validate(form: RoleForm, payload: dict[str, Any]) -> dict[str, Any]:
        "Проверяет поля анкеты схемой направления; ошибки отдаются как 422."
        try:
            return clean_payload(form, payload)
        except ValidationError as error:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=error.errors()[0].get("msg", "Некорректные поля анкеты"),
            ) from error
