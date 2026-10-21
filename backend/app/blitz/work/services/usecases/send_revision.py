"""Заказчик присылает исправленную документацию."""

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import (
    AUDIT_EXTENSIONS,
    AUDIT_FILE_SIZE_MB,
    DOCUMENT_EXTENSIONS,
    MAX_FILE_SIZE_MB,
    OrderFiles,
)
from app.blitz.documents.services.validators import required_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_owner, require_status
from app.core.clock import now
from models.account import Account


class SendRevisionUseCase:
    """Закрывает открытый раунд замечаний и возвращает заявку исполнителю. У аудита — форматы аудита."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        order: BlitzOrder,
        text: str,
        uploads: list[UploadFile],
    ) -> BlitzOrder:
        """Без файлов — InvalidOrderError."""

        require_owner(order, customer)
        require_status(order, OrderStatus.REMARKS, "Сейчас исправления не ожидаются")

        files = required_files(uploads, "Приложите исправленную документацию")
        remark = next((item for item in order.remarks if item.resolved_at is None), None)

        audit = order.service == ServiceKind.AUDIT
        extensions = AUDIT_EXTENSIONS if audit else DOCUMENT_EXTENSIONS
        size = AUDIT_FILE_SIZE_MB if audit else MAX_FILE_SIZE_MB

        async with self.files.saved(
            order.id,
            files,
            DocumentKind.REVISION,
            customer.id,
            extensions,
            size,
        ) as documents:
            order.documents.extend(documents)

            if remark is not None:
                remark.documents.extend(documents)
                remark.response_text = text.strip() or None
                remark.resolved_at = now()

            order.move_to(OrderStatus.IN_PROGRESS, Actor.CUSTOMER)
            await self.orders.save()

        await self.notifier.notify(order.expert, order, "Заказчик исправил замечания и прислал документы")

        return order
