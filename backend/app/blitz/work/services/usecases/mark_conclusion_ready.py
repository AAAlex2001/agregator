"""Исполнитель сообщает, что заключение или отчёт об аудите готов."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from app.blitz.orders.services.wording import wording_for
from models.account import Account


class MarkConclusionReadyUseCase:
    """Заявка ждёт оплаты остатка."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, expert: Account, order: BlitzOrder) -> BlitzOrder:
        """Только пока исполнитель работает."""

        require_assigned(order, expert)
        wording = wording_for(order)
        require_status(order, OrderStatus.IN_PROGRESS, f"{wording.result.capitalize()} готовят в ходе работы")

        order.move_to(OrderStatus.CONCLUSION_READY, Actor.EXPERT)
        await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            f"{wording.result.capitalize()} готов. "
            f"Оплатите остаток, и {wording.executor.lower()} отправит его вам",
        )

        return order
