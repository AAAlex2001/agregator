from fastapi import HTTPException, status

from models.order import Order
from services.orders.repository import OrderRepository


class GetOrderByPublicIdUseCase:
    def __init__(self, repo: OrderRepository):
        self.repo = repo

    async def execute(self, public_id: str) -> Order:
        order = await self.repo.get_by_public_id(public_id)
        if order is not None:
            return order
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )
