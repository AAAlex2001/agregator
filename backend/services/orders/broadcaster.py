from models.order import Order
from schemas.order import OrderResponse as OrderResponseSchema
from ws.manager import order_manager


class OrderBroadcaster:
    "Оборачивает broadcast-события по заказам в один именованный класс."

    async def order_created(self, order: Order) -> None:
        await order_manager.broadcast(
            {
                "event": "order_created",
                "data": OrderResponseSchema.from_order(order).model_dump(),
            }
        )

    async def order_updated(self, order: Order) -> None:
        await order_manager.broadcast(
            {
                "event": "order_updated",
                "data": OrderResponseSchema.from_order(order).model_dump(),
            }
        )

    async def order_removed(self, order_id: int) -> None:
        await order_manager.broadcast(
            {
                "event": "order_removed",
                "data": {"id": order_id},
            }
        )
