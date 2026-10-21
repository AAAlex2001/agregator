"""Руководитель группы предлагает цену, если бюджета нет или заказчик готов его обсуждать."""

from decimal import Decimal

from app.blitz.audit.services.exceptions import AuditorRequiredError
from app.blitz.audit.services.negotiation import negotiable
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.core.money import format_rub
from models.account import Account


class ProposePriceUseCase:
    """Руководитель группы предлагает цену, если бюджета нет или заказчик готов его обсуждать."""

    def __init__(self, orders: OrderRepository, audits: AuditRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.audits = audits
        self.notifier = notifier

    async def execute(self, lead: Account, order: BlitzOrder, price: Decimal) -> BlitzOrder:
        """Заявку уже взяли — OrderStateError, нет анкеты аудитора — AuditorRequiredError."""

        if order.service != ServiceKind.AUDIT:
            raise InvalidOrderError("Предложить цену можно только по заявке на аудит")

        if order.status != OrderStatus.NEW or order.expert_id is not None:
            raise OrderStateError("Заявку уже взял другой аудитор")

        if not await self.audits.is_auditor(lead.id):
            raise AuditorRequiredError

        if order.price is not None and not negotiable(order):
            raise OrderStateError("Заказчик не готов обсуждать цену: возьмите заявку по его цене")

        order.expert = lead
        order.offer_price = price
        order.counter_price = None
        order.move_to(OrderStatus.OFFER, Actor.EXPERT, f"Предложена цена {format_rub(price)}")
        await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            f"Аудитор предложил цену {format_rub(price)}. Примите её, предложите свою или откажитесь",
        )

        return order
