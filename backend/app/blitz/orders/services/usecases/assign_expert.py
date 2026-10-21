"""Администратор назначает исполнителя вместо того, чтобы ждать, пока заявку возьмут."""

from app.blitz.audit.services.repo import AuditRepository
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.validators import resolve_kind
from app.blitz.orders.services.wording import wording_for
from models.account import Account

ASSIGNABLE = frozenset(
    {
        OrderStatus.NEW,
        OrderStatus.CONSULTATION,
        OrderStatus.OFFER,
        OrderStatus.COUNTER,
        OrderStatus.EXPERT_READY,
    },
)


class AssignExpertUseCase:
    """Закрепляет заявку за экспертом или руководителем аудиторской группы и просит подписать договор."""

    def __init__(self, orders: OrderRepository, audits: AuditRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.audits = audits
        self.notifier = notifier

    async def execute(self, order: BlitzOrder, expert_id: int, contract_kind: str | None) -> BlitzOrder:
        """После подписания договора исполнителя не меняют — OrderStateError."""

        if order.status not in ASSIGNABLE:
            raise OrderStateError("Исполнителя меняют только до подписания договора")

        if order.price is None:
            raise InvalidOrderError("Сначала укажите цену заявки")

        expert = await self.executor(order, expert_id)

        if contract_kind is not None or order.contract_kind is None:
            order.contract_kind = resolve_kind(order.object_code, contract_kind)

        if order.contract_kind is None:
            raise InvalidOrderError("Выберите вид договора")

        wording = wording_for(order)
        previous = order.expert
        order.expert = expert
        order.offer_price = None
        order.counter_price = None
        order.move_to(OrderStatus.EXPERT_READY, Actor.ADMIN, f"Назначен исполнитель {expert.display_name}")
        await self.orders.save()

        if previous is not None and previous.id != expert.id:
            await self.notifier.notify(previous, order, "Администратор передал заявку другому исполнителю")

        await self.notifier.notify(expert, order, "Администратор назначил вас исполнителем по заявке")
        await self.notifier.notify(
            order.customer,
            order,
            f"{wording.executor} готов провести {wording.work}. Подпишите договор",
        )

        return order

    async def executor(self, order: BlitzOrder, expert_id: int) -> Account:
        """Активный эксперт, а для аудита — руководитель группы. Иначе InvalidOrderError."""

        expert = await self.orders.get_expert(expert_id)
        if expert is None:
            raise InvalidOrderError("Такого эксперта нет")

        if order.service == ServiceKind.AUDIT and not await self.audits.is_lead(expert.id):
            raise InvalidOrderError("Аудит проводит руководитель аудиторской группы")

        return expert
