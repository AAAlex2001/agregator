"""Заказчик принимает цену аудитора, предлагает свою ниже или отказывается."""

from decimal import Decimal

from app.blitz.audit.schemas import OfferAnswer
from app.blitz.audit.services.negotiation import agree, negotiable, release
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner, require_status
from app.core.money import format_rub
from models.account import Account


class AnswerOfferUseCase:
    """Заказчик принимает цену аудитора, предлагает свою ниже или отказывается."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        order: BlitzOrder,
        answer: OfferAnswer,
        price: Decimal | None,
    ) -> BlitzOrder:
        """Своя цена выше предложенной или бюджет фиксирован — InvalidOrderError и OrderStateError."""

        require_owner(order, customer)
        require_status(order, OrderStatus.OFFER, "Предложения по цене сейчас нет")

        lead = order.expert
        offer = order.offer_price or Decimal(0)

        if answer == "accept":
            agree(order, offer, Actor.CUSTOMER, f"Цена {format_rub(offer)} принята")
            message = f"Заказчик принял цену {format_rub(offer)}. Ждём подписания договора"
        elif answer == "counter":
            message = self.counter(order, offer, price)
        else:
            release(order, Actor.CUSTOMER, "Заказчик отказался от предложенной цены")
            message = "Заказчик отказался от цены, заявка вернулась в общий список"

        await self.orders.save()
        await self.notifier.notify(lead, order, message)

        return order

    def counter(self, order: BlitzOrder, offer: Decimal, price: Decimal | None) -> str:
        """Встречная цена ниже предложенной. Возвращает текст руководителю группы."""

        if not negotiable(order):
            raise OrderStateError("Вы указали, что бюджет фиксирован: примите цену или откажитесь")

        if price is None or price >= offer:
            raise InvalidOrderError("Предложите цену ниже цены аудитора")

        order.counter_price = price
        order.move_to(OrderStatus.COUNTER, Actor.CUSTOMER, f"Предложена цена {format_rub(price)}")

        return f"Заказчик предложил {format_rub(price)} вместо {format_rub(offer)}. Примите или откажитесь"
