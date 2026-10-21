"""Администратор назначает эксперта вместо того, чтобы ждать, пока заявку возьмут."""

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.validators import resolve_kind

ASSIGNABLE = frozenset({OrderStatus.NEW, OrderStatus.EXPERT_READY})


class AssignExpertUseCase:
    """Закрепляет заявку за экспертом и просит заказчика подписать договор."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, expert_id: int, contract_kind: str | None) -> BlitzOrder:
        """После подписания договора эксперта не меняют — OrderStateError."""

        if order.status not in ASSIGNABLE:
            raise OrderStateError("Эксперта меняют только до подписания договора")

        expert = await self.orders.get_expert(expert_id)
        if expert is None:
            raise InvalidOrderError("Такого эксперта нет")

        if contract_kind is not None or order.contract_kind is None:
            order.contract_kind = resolve_kind(order.object_code, contract_kind)

        if order.contract_kind is None:
            raise InvalidOrderError("Выберите вид договора")

        previous = order.expert
        order.expert = expert
        order.move_to(OrderStatus.EXPERT_READY, Actor.ADMIN, f"Назначен эксперт {expert.display_name}")
        await self.orders.save()

        if previous is not None and previous.id != expert.id:
            await self.notifier.notify(previous, order, "Администратор передал заявку другому эксперту")

        await self.notifier.notify(expert, order, "Администратор назначил вас экспертом по заявке")
        await self.notifier.notify(
            order.customer,
            order,
            f"Эксперт {expert.display_name} готов провести экспертизу. Подпишите договор",
        )

        return order
