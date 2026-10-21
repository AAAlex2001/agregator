"""Кто видит заявку: заказчик, исполнитель, аудиторы группы и эксперт, который может её взять.

Экспертизу берут по удостоверениям, аудит — руководители аудиторских групп.
"""

from datetime import date

from app.blitz.orders.models import BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.matching import expert_fits
from models.account import Account, UserRole


def in_team(order: BlitzOrder, viewer: Account) -> bool:
    """Аудитор из группы заявки."""

    return any(member.account_id == viewer.id for member in order.team)


def can_take(order: BlitzOrder, expert: Account, today: date, audit_lead: bool) -> bool:
    """Новая заявка без исполнителя, которую этот эксперт может взять."""

    if expert.role != UserRole.EXPERT or order.status != OrderStatus.NEW or order.expert_id is not None:
        return False

    if order.service == ServiceKind.AUDIT:
        return audit_lead

    return expert_fits(expert, order, today)


def can_view(order: BlitzOrder, viewer: Account, today: date, audit_lead: bool) -> bool:
    """Своя заявка, взятая в работу, заявка своей группы или та, которую можно взять."""

    if viewer.id in (order.customer_id, order.expert_id) or in_team(order, viewer):
        return True

    return can_take(order, viewer, today, audit_lead)
