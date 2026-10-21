"""Заказчик согласует План: открываются загрузка и проверка документов."""

from app.blitz.audit.services.auditors import team_accounts
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner, require_status
from models.account import Account


class ApprovePlanUseCase:
    """Заказчик согласует План: открываются загрузка и проверка документов."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, customer: Account, order: BlitzOrder) -> BlitzOrder:
        """Только когда План ждёт согласования."""

        require_owner(order, customer)
        require_status(order, OrderStatus.PLAN_REVIEW, "План аудита сейчас не ждёт согласования")

        order.move_to(OrderStatus.IN_PROGRESS, Actor.CUSTOMER, "План согласован")
        await self.orders.save()

        await self.notifier.notify_all(
            team_accounts(order),
            order,
            "Заказчик согласовал План аудита. Документы открыты для проверки",
        )

        return order
