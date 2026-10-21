"""Торг по цене аудита: один круг предложений, договорились — договор, нет — заявка в общий список."""

from decimal import Decimal

from app.blitz.audit.schemas import AuditDetailsSchema
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus


def details_of(order: BlitzOrder) -> AuditDetailsSchema:
    """Анкета аудита из заявки."""

    return AuditDetailsSchema.model_validate(order.audit_details)


def negotiable(order: BlitzOrder) -> bool:
    """Готов ли заказчик обсуждать стоимость."""

    return details_of(order).budget.negotiation != "no"


def agree(order: BlitzOrder, price: Decimal, actor: Actor, note: str) -> None:
    """Стороны сошлись на цене: дальше договор, как после «Готов провести»."""

    order.price = price
    order.offer_price = None
    order.counter_price = None
    order.move_to(OrderStatus.EXPERT_READY, actor, note)


def release(order: BlitzOrder, actor: Actor, note: str) -> None:
    """Не договорились: руководитель снят, предложения обнулены, заявка снова ждёт аудитора."""

    order.expert = None
    order.offer_price = None
    order.counter_price = None
    order.move_to(OrderStatus.NEW, actor, note)
