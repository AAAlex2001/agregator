"""Эксперт или аудитор берёт заявку по цене заказчика. Взявший аудит руководит его группой."""

from datetime import date

from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.access import can_take
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderAccessError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.validators import require_expert, resolve_kind
from models.account import Account


class AcceptOrderUseCase:
    """Закрепляет заявку за первым, кто готов. Если вид договора не ясен, его выбирает эксперт."""

    def __init__(self, orders: OrderRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.notifier = notifier

    async def execute(
        self,
        expert: Account,
        order: BlitzOrder,
        contract_kind: str | None,
        auditor: bool,
    ) -> BlitzOrder:
        """Заявку уже взяли — OrderStateError, не подходит эксперту — OrderAccessError."""

        require_expert(expert)
        audit = order.service == ServiceKind.AUDIT

        if order.status != OrderStatus.NEW or order.expert_id is not None:
            raise OrderStateError("Заявку уже взял другой исполнитель")

        if not can_take(order, expert, date.today(), auditor):
            raise OrderAccessError(
                "Заявки на аудит берут эксперты с анкетой «Аудит СУПБ»"
                if audit
                else "Ваши удостоверения не подходят под эту заявку",
            )

        if order.price is None:
            raise OrderStateError("Заказчик не указал цену: предложите свою")

        if order.contract_kind is None:
            order.contract_kind = resolve_kind(order.object_code, contract_kind)

        if order.contract_kind is None:
            raise InvalidOrderError("Выберите вид договора по проекту заказчика")

        order.expert = expert
        order.move_to(OrderStatus.EXPERT_READY, Actor.EXPERT)
        await self.orders.save()

        executor = "Аудитор" if audit else f"Эксперт {expert.display_name}"
        work = "аудит" if audit else "экспертизу"
        await self.notifier.notify(
            order.customer,
            order,
            f"{executor} готов провести {work} по вашей цене. "
            "Проверьте договор и подпишите его, чтобы перейти к оплате аванса",
        )

        return order
