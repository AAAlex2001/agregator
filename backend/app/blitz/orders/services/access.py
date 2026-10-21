"""Кто видит заявку: заказчик, назначенный эксперт и эксперт, который может её взять."""

from datetime import date

from app.blitz.orders.models import BlitzOrder, OrderStatus
from app.blitz.orders.services.matching import expert_fits
from models.account import Account, UserRole


def can_take(order: BlitzOrder, expert: Account, today: date) -> bool:
    """Новая заявка без эксперта, под которую подходят удостоверения эксперта."""

    return (
        expert.role == UserRole.EXPERT
        and order.status == OrderStatus.NEW
        and order.expert_id is None
        and expert_fits(expert, order, today)
    )


def can_view(order: BlitzOrder, viewer: Account, today: date) -> bool:
    """Своя заявка, взятая в работу или та, которую можно взять."""

    if viewer.id in (order.customer_id, order.expert_id):
        return True

    return can_take(order, viewer, today)
