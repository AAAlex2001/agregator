"""Администратор ставит статус вручную, когда стороны договорились иначе."""

from app.blitz.audit.services.repo import AuditRepository
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.wording import parties, status_title

WITHOUT_EXECUTOR = frozenset({OrderStatus.NEW, OrderStatus.CONSULTATION, OrderStatus.CANCELED})
WITHOUT_PRICE = WITHOUT_EXECUTOR | {OrderStatus.OFFER, OrderStatus.COUNTER}
AUDIT_ONLY = frozenset(
    {
        OrderStatus.CONSULTATION,
        OrderStatus.OFFER,
        OrderStatus.COUNTER,
        OrderStatus.PLAN,
        OrderStatus.PLAN_REVIEW,
    },
)


class SetOrderStatusUseCase:
    """Любой статус с пометкой в истории. Возврат в «ждёт эксперта» снимает исполнителя.

    Заявка на аудит после консультации уходит аудиторам.
    """

    def __init__(self, orders: OrderRepository, audits: AuditRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.audits = audits
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, status: OrderStatus, note: str | None) -> BlitzOrder:
        """Тот же статус — OrderStateError. Чужой сервису, без исполнителя или цены — InvalidOrderError."""

        if status == order.status:
            raise OrderStateError("Заявка уже в этом статусе")

        if status in AUDIT_ONLY and order.service != ServiceKind.AUDIT:
            raise InvalidOrderError("Этот статус есть только у заявок на аудит")

        if status not in WITHOUT_EXECUTOR and order.expert_id is None:
            raise InvalidOrderError("Сначала назначьте исполнителя")

        if status not in WITHOUT_PRICE and order.price is None:
            raise InvalidOrderError("Сначала укажите цену")

        notified = parties(order)
        opened = order.service == ServiceKind.AUDIT and order.status == OrderStatus.CONSULTATION

        if status in WITHOUT_EXECUTOR:
            order.expert = None
            order.offer_price = None
            order.counter_price = None

        order.move_to(status, Actor.ADMIN, note)
        await self.orders.save()

        message = f"Администратор перевёл заявку в статус «{status_title(status)}»"
        await self.notifier.notify_all(notified, order, f"{message}. {note}" if note else message)

        if opened and status == OrderStatus.NEW:
            auditors = await self.audits.list_auditors()
            message = f"Новая заявка на аудит СУПБ: {order.object_name}"
            await self.notifier.notify_all(auditors, order, message)

        return order
