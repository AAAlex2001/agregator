
"Use case: list orders."
from models.order import Order, OrderStatus
from models.user import UserRole
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
        if user_id is None:
            return await self.repo.list_public_all(skip, limit, status_filter)

        role = await self.repo.get_user_role(user_id)
        if role == UserRole.EXPERT:
            return await self.repo.list_active_unassigned_unresponded_by_expert(
                user_id, skip, limit, status_filter
            )
        if role == UserRole.CUSTOMER:
            return await self.repo.list_for_customer(
                user_id, skip, limit, status_filter
            )
        return [], False
