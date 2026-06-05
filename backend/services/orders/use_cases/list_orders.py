
"Use case: list orders."
from models.order import Order, OrderStatus
from services.orders.repository import OrderRepository


class ListOrdersUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        skip: int,
        limit: int,
        status_filter: OrderStatus | None,
        user_id: int | None,
    ) -> tuple[list[Order], bool]:
        "Запускает основной сценарий use case."
        return await self.repo.list_for_user(skip, limit, status_filter, user_id)
