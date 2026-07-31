"""Типы заказов, доступные в фильтре уведомлений эксперта."""

from models.order import Order, OrderWorkType
from services.directions.registry import DIRECTIONS
from services.experts.badge_codes import ALL_BADGE_CODES

ENGINEERING_ORDER_NOTIFICATION_TYPES: tuple[str, ...] = (
    OrderWorkType.DESIGN_SURVEY.value,
    OrderWorkType.INSPECTION_TESTING.value,
    OrderWorkType.RESEARCH_LAB.value,
    OrderWorkType.OTHER.value,
)

DIRECTION_ORDER_NOTIFICATION_TYPES: tuple[str, ...] = tuple(
    direction.key for direction in DIRECTIONS
)

ALL_ORDER_NOTIFICATION_TYPES: tuple[str, ...] = (
    *ALL_BADGE_CODES,
    *ENGINEERING_ORDER_NOTIFICATION_TYPES,
    *DIRECTION_ORDER_NOTIFICATION_TYPES,
)
ALL_ORDER_NOTIFICATION_TYPES_SET: frozenset[str] = frozenset(
    ALL_ORDER_NOTIFICATION_TYPES
)


def notification_types_for_order(order: Order) -> set[str]:
    """Возвращает ключи подписки, которым соответствует заказ."""
    if order.work_type == OrderWorkType.EXPERTISE:
        return {badge.text for badge in order.badges}
    return {order.work_type.value}
