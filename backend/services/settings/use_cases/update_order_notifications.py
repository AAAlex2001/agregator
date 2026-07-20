"Use case: update order notifications."
from models.user import User
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateOrderNotificationsUseCase:
    "Сохраняет направления работ, по которым эксперт хочет уведомления о заказах."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, order_types: list[str]) -> User:
        "Запускает основной сценарий use case."
        user = await self.validator.require_expert(user_id)
        user.notify_order_types = order_types or None
        await self.repo.flush()
        return user
