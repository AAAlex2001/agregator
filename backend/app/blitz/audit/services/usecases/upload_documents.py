"""Заказчик загружает документы по перечню, пока аудиторы проверяют."""

from fastapi import UploadFile

from app.blitz.audit.services.files import saved_checklist_files
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.documents.services.validators import required_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError, OrderStateError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner
from models.account import Account

UPLOAD_STATUSES = frozenset({OrderStatus.IN_PROGRESS, OrderStatus.REMARKS})


class UploadAuditDocumentsUseCase:
    """Файлы к пунктам перечня после согласования Плана."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        order: BlitzOrder,
        uploads: list[UploadFile],
        items: list[int],
    ) -> BlitzOrder:
        """До согласования Плана — OrderStateError, без файлов — InvalidOrderError."""

        if order.service != ServiceKind.AUDIT:
            raise InvalidOrderError("Перечень документов есть только у аудита")

        require_owner(order, customer)

        if order.status not in UPLOAD_STATUSES:
            raise OrderStateError("Загрузка документов открывается после согласования Плана аудита")

        files = required_files(uploads, "Приложите хотя бы один документ")

        async with saved_checklist_files(self.files, order.id, files, items, customer.id) as documents:
            order.documents.extend(documents)
            await self.orders.save()

        await self.notifier.notify(order.expert, order, "Заказчик загрузил документы по перечню")

        return order
