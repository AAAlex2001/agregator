"Use case: сохранение анкеты направления."
from typing import Any

from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError

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

        data = self.validate(form, payload).model_dump(mode="json")

        if not form.is_separate_table:
            self.apply(profile, data)
            await self.repo.add(profile)
            return form.response_schema.model_validate(profile)

        target = getattr(profile, form.owner_attribute)
        if target is None:
            target = form.model(**data)
            setattr(profile, form.owner_attribute, target)
        else:
            self.apply(target, data)
        await self.repo.add(target)
        return form.response_schema.model_validate(target)

    @staticmethod
    def validate(form: RoleForm, payload: dict[str, Any]) -> BaseModel:
        "Проверяет поля анкеты схемой направления; ошибки отдаются как 422."
        try:
            return form.input_schema.model_validate(payload)
        except ValidationError as error:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=error.errors()[0].get("msg", "Некорректные поля анкеты"),
            ) from error

    @staticmethod
    def apply(target: object, data: dict[str, Any]) -> None:
        "Переносит значения схемы в поля модели."
        for field, value in data.items():
            setattr(target, field, value)
