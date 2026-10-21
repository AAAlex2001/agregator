"""Администратор меняет цену заявки, когда стороны договорились иначе.

Смена пишется в историю с причиной, стороны получают уведомление. Неоплаченные счета
аннулируются: следующий выставится на новую сумму. Остаток считается от нового прайса
минус уже оплаченное, поэтому цену нельзя опустить ниже оплаченного.
"""

from decimal import Decimal

from app.blitz.audit.options import MIN_AUDIT_PRICE
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.wording import parties
from app.blitz.pricing.models import PriceChange
from app.core.clock import now
from app.core.money import format_rub

LOCKED = frozenset({OrderStatus.PAID, OrderStatus.SENT, OrderStatus.ACCEPTED, OrderStatus.CANCELED})


class ChangePriceUseCase:
    """Новая цена до полной оплаты заявки."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, price: Decimal, reason: str) -> BlitzOrder:
        """После полной оплаты — OrderStateError, ниже оплаченного или минимума аудита — InvalidOrderError."""

        if order.status in LOCKED:
            raise OrderStateError("Цену меняют до полной оплаты заявки")

        if price == order.price:
            raise InvalidOrderError("Цена не изменилась")

        if price < order.paid_amount:
            paid = format_rub(order.paid_amount)
            raise InvalidOrderError(f"Уже оплачено {paid}: цена не может быть меньше")

        if order.service == ServiceKind.AUDIT and price < MIN_AUDIT_PRICE:
            raise InvalidOrderError(f"Стоимость аудита — не менее {format_rub(MIN_AUDIT_PRICE)}")

        reason = reason.strip()
        old_price = order.price
        order.price_changes.append(
            PriceChange(old_price=old_price, new_price=price, reason=reason, created_at=now()),
        )
        order.price = price

        for invoice in order.invoices:
            if invoice.is_open:
                invoice.canceled_at = now()

        await self.orders.save()

        was = f"было {format_rub(old_price)}, " if old_price is not None else ""
        await self.notifier.notify_all(
            parties(order),
            order,
            f"Цена заявки изменена: {was}стало {format_rub(price)}. {reason}",
        )

        return order
