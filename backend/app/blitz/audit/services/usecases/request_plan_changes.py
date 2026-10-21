"""Заказчик просит поправить План: руководитель получает комментарий."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner, require_status
from models.account import Account


class RequestPlanChangesUseCase:
    """Заказчик просит поправить План: руководитель получает комментарий."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, customer: Account, order: BlitzOrder, comment: str) -> BlitzOrder:
        """Только когда План ждёт согласования."""

        require_owner(order, customer)
        require_status(order, OrderStatus.PLAN_REVIEW, "План аудита сейчас не ждёт согласования")

        order.plan_comment = comment.strip()
        order.move_to(OrderStatus.PLAN, Actor.CUSTOMER, order.plan_comment)
        await self.orders.save()

        await self.notifier.notify(
            order.expert,
            order,
            f"Заказчик просит поправить План аудита: {order.plan_comment}",
        )

        return order
