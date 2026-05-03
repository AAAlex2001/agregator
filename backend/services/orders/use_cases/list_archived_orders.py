from models.order import Order
from services.orders.repository import OrderRepository


class ListArchivedOrdersUseCase:
    "Список архивных заказов — для всех авторизованных пользователей."

    def __init__(self, repo: OrderRepository):
        self.repo = repo

    async def execute(self, skip: int, limit: int) -> tuple[list[Order], int]:
        return await self.repo.list_archived(skip, limit)
