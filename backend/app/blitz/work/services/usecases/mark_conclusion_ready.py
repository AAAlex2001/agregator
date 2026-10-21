"""Эксперт сообщает, что заключение готово."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from models.account import Account


class MarkConclusionReadyUseCase:
    """Заявка ждёт оплаты остатка."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, expert: Account, order: BlitzOrder) -> BlitzOrder:
        """Только пока эксперт работает."""

        require_assigned(order, expert)
        require_status(order, OrderStatus.IN_PROGRESS, "Заключение готовят после оплаты аванса")

        order.move_to(OrderStatus.CONCLUSION_READY, Actor.EXPERT)
        await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            "Заключение готово. Оплатите остаток, и эксперт отправит его вам",
        )

        return order
