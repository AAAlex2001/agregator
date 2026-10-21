"""Заказчик принимает работу."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner, require_status
from models.account import Account


class AcceptWorkUseCase:
    """Заявка завершена, становится доступен акт."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, customer: Account, order: BlitzOrder) -> BlitzOrder:
        """Только после отправки заключения."""

        require_owner(order, customer)
        require_status(order, OrderStatus.SENT, "Заключение ещё не отправлено")

        order.move_to(OrderStatus.ACCEPTED, Actor.CUSTOMER)
        await self.orders.save()

        await self.notifier.notify(order.expert, order, "Заказчик принял работу. Спасибо!")

        return order
