"""Кто и в каком статусе может сделать шаг работы."""

from app.blitz.orders.models import BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import OrderAccessError, OrderStateError
from models.account import Account


def require_assigned(order: BlitzOrder, expert: Account) -> None:
    """Шаг эксперта, который ведёт заявку."""

    if order.expert_id != expert.id:
        raise OrderAccessError("Заявку ведёт другой эксперт")


def require_owner(order: BlitzOrder, customer: Account) -> None:
    """Шаг заказчика этой заявки."""

    if order.customer_id != customer.id:
        raise OrderAccessError("Действие доступно заказчику заявки")


def require_status(order: BlitzOrder, status: OrderStatus, message: str) -> None:
    """Заявка в нужном статусе. Иначе OrderStateError."""

    if order.status != status:
        raise OrderStateError(message)
