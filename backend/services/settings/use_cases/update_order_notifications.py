"Use case: update order notifications."
from models.account import Account
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateOrderNotificationsUseCase:
    "Сохраняет направления работ, по которым эксперт хочет уведомления о заказах."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, order_types: list[str]) -> Account:
        "Запускает основной сценарий use case."
        account = await self.validator.require_expert(user_id)
        expert = self.validator.require_expert_profile(account)
        expert.notify_order_types = order_types or None
        await self.repo.flush()
        return account
