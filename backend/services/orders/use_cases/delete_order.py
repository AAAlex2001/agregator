from services.orders.broadcaster import OrderBroadcaster
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase


class DeleteOrderUseCase:
    def __init__(
        self,
        repo: OrderRepository,
        get_order: GetOrderByIdUseCase,
        broadcaster: OrderBroadcaster,
    ):
        self.repo = repo
        self.get_order = get_order
        self.broadcaster = broadcaster

    async def execute(self, order_id: int) -> int:
        order = await self.get_order.execute(order_id)
        await self.repo.delete(order)
        await self.repo.flush()
        await self.broadcaster.order_removed(order_id)
        return order_id
