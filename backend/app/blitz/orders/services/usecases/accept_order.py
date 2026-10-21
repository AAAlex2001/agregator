"""Эксперт берёт заявку по цене заказчика."""

from datetime import date

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderAccessError, OrderStateError
from app.blitz.orders.services.matching import expert_fits
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.validators import require_expert, resolve_kind
from models.account import Account


class AcceptOrderUseCase:
    """Закрепляет заявку за первым экспертом. Если вид договора не ясен, его выбирает эксперт."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, expert: Account, order: BlitzOrder, contract_kind: str | None) -> BlitzOrder:
        """Заявку уже взяли — OrderStateError, удостоверения не подходят — OrderAccessError."""

        require_expert(expert)

        if order.status != OrderStatus.NEW or order.expert_id is not None:
            raise OrderStateError("Заявку уже взял другой эксперт")

        if not expert_fits(expert, order, date.today()):
            raise OrderAccessError("Ваши удостоверения не подходят под эту заявку")

        if order.contract_kind is None:
            order.contract_kind = resolve_kind(order.object_code, contract_kind)

        if order.contract_kind is None:
            raise InvalidOrderError("Выберите вид договора по проекту заказчика")

        order.expert = expert
        order.move_to(OrderStatus.EXPERT_READY, Actor.EXPERT)
        await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            f"Эксперт {expert.display_name} готов провести экспертизу по вашей цене. "
            "Проверьте договор и подпишите его, чтобы перейти к оплате аванса",
        )

        return order
