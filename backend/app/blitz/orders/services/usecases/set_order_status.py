"""Администратор ставит статус вручную, когда стороны договорились иначе."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.wording import parties, status_title

WITHOUT_EXPERT = frozenset({OrderStatus.NEW, OrderStatus.CANCELED})


class SetOrderStatusUseCase:
    """Любой статус с пометкой в истории. Возврат в «ждёт эксперта» снимает эксперта."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, status: OrderStatus, note: str | None) -> BlitzOrder:
        """Тот же статус — OrderStateError, статус в работе без эксперта — InvalidOrderError."""

        if status == order.status:
            raise OrderStateError("Заявка уже в этом статусе")

        if status not in WITHOUT_EXPERT and order.expert_id is None:
            raise InvalidOrderError("Сначала назначьте эксперта")

        notified = parties(order)

        if status == OrderStatus.NEW:
            order.expert = None

        order.move_to(status, Actor.ADMIN, note)
        await self.orders.save()

        message = f"Администратор перевёл заявку в статус «{status_title(status)}»"
        await self.notifier.notify_all(notified, order, f"{message}. {note}" if note else message)

        return order
