"""Руководитель набирает аудиторскую группу."""

from app.blitz.audit.models import AuditTeamMember
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned
from models.account import Account

TEAM_STATUSES = frozenset({OrderStatus.CONTRACT, OrderStatus.PLAN})


class SetTeamUseCase:
    """Заменяет состав группы целиком, пока План не отправлен: заказчик видит группу в Плане."""

    def __init__(self, orders: OrderRepository, audits: AuditRepository, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.audits = audits
        self.notifier = notifier

    async def execute(self, lead: Account, order: BlitzOrder, account_ids: list[int]) -> BlitzOrder:
        """Не аудиторы в списке — InvalidOrderError."""

        require_assigned(order, lead)

        if order.status not in TEAM_STATUSES:
            raise OrderStateError("Состав группы меняется до отправки Плана аудита")

        auditors = {account.id: account for account in await self.audits.list_auditors()}
        chosen = list(dict.fromkeys(account_id for account_id in account_ids if account_id != lead.id))

        if any(account_id not in auditors for account_id in chosen):
            raise InvalidOrderError("В группу можно включить только аудиторов")

        current = {member.account_id for member in order.team}
        order.team = [
            AuditTeamMember(account_id=account_id, account=auditors[account_id])
            for account_id in chosen
        ]
        await self.orders.save()

        added = [auditors[account_id] for account_id in chosen if account_id not in current]
        await self.notifier.notify_all(added, order, "Вас включили в аудиторскую группу")

        return order
