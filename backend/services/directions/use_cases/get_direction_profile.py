"Use case: чтение анкеты направления."
from pydantic import BaseModel

from services.directions.validators import DirectionsValidator


class GetDirectionProfileUseCase:
    "Возвращает анкету направления для роли аккаунта или пустую с дефолтами."

    def __init__(self, validator: DirectionsValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int, direction_key: str) -> BaseModel:
        "Запускает основной сценарий use case."
        direction = self.validator.require_direction(direction_key)
        account = await self.validator.require_account(account_id)
        form = self.validator.require_form(account, direction)
        profile = self.validator.require_role_profile(account)

        source = profile if not form.is_separate_table else getattr(profile, form.owner_attribute)
        if source is None:
            return form.response_schema()
        return form.response_schema.model_validate(source)
