from typing import Optional

from models.order import Order, OrderStatus
from services.orders.repository import OrderRepository


class ListOrdersUseCase:
    def __init__(self, repo: OrderRepository):
        self.repo = repo

    async def execute(
        self,
        skip: int,
        limit: int,
        status_filter: Optional[OrderStatus],
        user_id: Optional[int],
    ) -> tuple[list[Order], int]:
        return await self.repo.list_for_user(skip, limit, status_filter, user_id)
