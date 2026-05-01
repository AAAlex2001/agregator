from services.orders.broadcaster import OrderBroadcaster
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.validators import OrderValidator


class DeleteOrderUseCase:
    def __init__(
        self,
        repo: OrderRepository,
        get_order: GetOrderByIdUseCase,
        validator: OrderValidator,
        broadcaster: OrderBroadcaster,
    ):
        self.repo = repo
        self.get_order = get_order
        self.validator = validator
        self.broadcaster = broadcaster

    async def execute(self, order_id: int, current_user_id: int) -> int:
        await self.validator.ensure_user_can_modify_order(order_id, current_user_id)

        order = await self.get_order.execute(order_id)
        await self.repo.delete(order)
        await self.repo.flush()
        await self.broadcaster.order_removed(order_id)
        return order_id
