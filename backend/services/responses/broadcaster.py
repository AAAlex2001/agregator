from models.order import Order
from schemas.order import OrderResponse as OrderResponseSchema
from ws.manager import order_manager


class ResponseBroadcaster:
    "WS-события по заказу, которые вызываются в ходе жизни откликов (возвращение заказа в ленту и т.п.)."

    async def order_reopened(self, order: Order) -> None:
        "Отказ / отзыв исполнителя — заказ снова доступен для откликов, кидаем в ленту."
        await order_manager.broadcast(
            {
                "event": "order_created",
                "data": OrderResponseSchema.from_order(order).model_dump(),
            }
        )

    async def order_completed(self, order: Order) -> None:
        await order_manager.broadcast(
            {
                "event": "order_updated",
                "data": OrderResponseSchema.from_order(order).model_dump(),
            }
        )

    async def order_removed(self, order_id: int) -> None:
        "Заказчик выбрал исполнителя — заказ уходит из публичной ленты."
        await order_manager.broadcast(
            {
                "event": "order_removed",
                "data": {"id": order_id},
            }
        )
