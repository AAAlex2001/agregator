"""Эксперт возвращает документацию с замечаниями."""

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.documents.services.validators import chosen_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from app.blitz.work.models import OrderRemark
from app.core.clock import now
from models.account import Account


class SendRemarksUseCase:
    """Новый раунд замечаний: текст, файлы или и то и другое. Заявка ждёт исправлений."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        expert: Account,
        order: BlitzOrder,
        text: str,
        uploads: list[UploadFile],
    ) -> BlitzOrder:
        """Ни текста, ни файлов — InvalidOrderError."""

        require_assigned(order, expert)
        require_status(order, OrderStatus.IN_PROGRESS, "Замечания выдаются, пока эксперт работает")

        text = text.strip()
        files = chosen_files(uploads)
        if not text and not files:
            raise InvalidOrderError("Напишите замечания или приложите файл")

        remark = OrderRemark(text=text or None, created_at=now())

        async with self.files.saved(order.id, files, DocumentKind.REMARKS, expert.id) as documents:
            order.remarks.append(remark)
            order.documents.extend(documents)
            remark.documents.extend(documents)
            order.move_to(OrderStatus.REMARKS, Actor.EXPERT)
            await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            "Эксперт прислал замечания. Исправьте документацию и отправьте её повторно",
        )

        return order
