"Use case: список направлений роли с признаком заполненности анкеты."
from models.account import UserRole
from schemas.directions import DirectionSummary
from services.directions.registry import directions_for_role
from services.directions.validators import DirectionsValidator


class ListRoleDirectionsUseCase:
    "Отдаёт направления, доступные роли аккаунта, и отмечает заполненные анкеты."

    def __init__(self, validator: DirectionsValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> list[DirectionSummary]:
        "Запускает основной сценарий use case."
        account = await self.validator.require_account(account_id)
        role: UserRole = account.role
        return [
            DirectionSummary(
                key=direction.key,
                title=direction.title,
                profile_filled=self.validator.is_form_filled(account, direction),
            )
            for direction in directions_for_role(role)
        ]
