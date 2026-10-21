"""Отмена заявки заказчиком до подписания договора или администратором в любой момент до приёмки."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import FINISHED, Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import OrderAccessError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.wording import parties
from app.core.clock import now
from models.account import Account

CUSTOMER_CANCELABLE = frozenset(
    {
        OrderStatus.NEW,
        OrderStatus.CONSULTATION,
        OrderStatus.OFFER,
        OrderStatus.COUNTER,
        OrderStatus.EXPERT_READY,
    },
)


class CancelOrderUseCase:
    """Переводит заявку в «отменена» и сообщает другой стороне."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def by_customer(self, customer: Account, order: BlitzOrder, reason: str) -> BlitzOrder:
        """Заказчик отменяет свою заявку, пока договор не подписан."""

        if order.customer_id != customer.id:
            raise OrderAccessError("Отменить заявку может только заказчик")

        if order.status not in CUSTOMER_CANCELABLE:
            raise OrderStateError("После подписания договора отменить заявку может администратор")

        await self.cancel(order, Actor.CUSTOMER, reason)
        await self.notifier.notify(order.expert, order, f"Заказчик отменил заявку: {reason}")
        self.notifier.notify_admins(order, f"Заказчик отменил заявку: {reason}")

        return order

    async def by_admin(self, order: BlitzOrder, reason: str) -> BlitzOrder:
        """Администратор отменяет незавершённую заявку."""

        if order.status in FINISHED:
            raise OrderStateError("Заявка уже завершена")

        await self.cancel(order, Actor.ADMIN, reason)
        await self.notifier.notify_all(parties(order), order, f"Администратор отменил заявку: {reason}")

        return order

    async def cancel(self, order: BlitzOrder, actor: Actor, reason: str) -> None:
        """Сменить статус, записать причину и аннулировать неоплаченные счета."""

        reason = reason.strip()
        order.cancel_reason = reason

        for invoice in order.invoices:
            if invoice.is_open:
                invoice.canceled_at = now()

        order.move_to(OrderStatus.CANCELED, actor, reason)
        await self.orders.save()
