"Use case: get order by id."
from fastapi import HTTPException, status

from models.order import Order
from services.orders.repository import OrderRepository


class GetOrderByIdUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def execute(self, order_id: int) -> Order:
        "Запускает основной сценарий use case."
        order = await self.repo.get_by_id(order_id)
        if order is not None:
            return order
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )
