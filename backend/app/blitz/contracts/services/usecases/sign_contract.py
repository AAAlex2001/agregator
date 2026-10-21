"""Заказчик подписывает договор и соглашение о конфиденциальности.

Оба документа собираются в момент подписи и хранятся файлами: если потом поменяются шаблоны
или реквизиты, у сторон останется ровно тот текст, с которым заказчик согласился.
"""

from app.blitz.company import vat_rate
from app.blitz.contracts.services.document import Paper, build_paper, contract_problem, paper_name
from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import OrderAccessError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.core.clock import now
from models.account import Account

PAPER_KINDS = {Paper.CONTRACT: DocumentKind.CONTRACT, Paper.NDA: DocumentKind.NDA}


class SignContractUseCase:
    """Переводит заявку в «договор подписан» и просит оплатить аванс."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(self, customer: Account, order: BlitzOrder) -> BlitzOrder:
        """Подписать может только заказчик и только когда эксперт готов."""

        if order.customer_id != customer.id:
            raise OrderAccessError("Подписать договор может только заказчик")

        if order.status != OrderStatus.EXPERT_READY:
            raise OrderStateError("Договор подписывается, когда эксперт готов провести экспертизу")

        problem = contract_problem(order)
        if problem is not None:
            raise OrderStateError(problem)

        signed_at = now()
        rate = vat_rate()

        for paper, kind in PAPER_KINDS.items():
            content = build_paper(paper, order, rate, signed_at)
            name = paper_name(paper, order, signed_at)
            order.documents.append(self.files.generated(order.id, content, name, kind, customer.id))

        order.move_to(OrderStatus.CONTRACT, Actor.CUSTOMER)
        await self.orders.save()

        await self.notifier.notify(
            order.expert,
            order,
            "Заказчик подписал договор и соглашение о конфиденциальности. Ждём аванс",
        )

        return order
