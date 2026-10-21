"""Руководитель группы соглашается на цену заказчика или отказывается от заявки."""

from decimal import Decimal

from app.blitz.audit.services.negotiation import agree, release
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from app.core.money import format_rub
from models.account import Account


class AnswerCounterUseCase:
    """Руководитель группы соглашается на цену заказчика или отказывается от заявки."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, lead: Account, order: BlitzOrder, accept: bool) -> BlitzOrder:
        """Отвечает только тот, кто предлагал цену."""

        require_assigned(order, lead)
        require_status(order, OrderStatus.COUNTER, "Встречного предложения сейчас нет")

        counter = order.counter_price or Decimal(0)

        if accept:
            agree(order, counter, Actor.EXPERT, f"Цена {format_rub(counter)} принята")
            message = f"Аудитор согласился на цену {format_rub(counter)}. Подпишите договор"
        else:
            release(order, Actor.EXPERT, "Аудитор не согласился на цену заказчика")
            message = "Аудитор не согласился на вашу цену. Заявка вернулась в общий список"

        await self.orders.save()
        await self.notifier.notify(order.customer, order, message)

        return order
