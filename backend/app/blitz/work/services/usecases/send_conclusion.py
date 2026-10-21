"""Эксперт отправляет подписанное ЭЦП заключение."""

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import SIGNED_EXTENSIONS, OrderFiles
from app.blitz.documents.services.validators import required_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, ConclusionResult, OrderStatus
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from models.account import Account

RESULT_TITLES = {ConclusionResult.POSITIVE: "положительное", ConclusionResult.NEGATIVE: "отрицательное"}


class SendConclusionUseCase:
    """Файлы заключения и исход. ЭЦП ставится средством подписи эксперта до загрузки."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        expert: Account,
        order: BlitzOrder,
        result: ConclusionResult,
        uploads: list[UploadFile],
    ) -> BlitzOrder:
        """Только после оплаты остатка. Без файла — InvalidOrderError."""

        require_assigned(order, expert)
        require_status(order, OrderStatus.PAID, "Заключение отправляют после оплаты остатка")

        files = required_files(uploads, "Приложите файл заключения")
        title = RESULT_TITLES[result]

        async with self.files.saved(
            order.id,
            files,
            DocumentKind.CONCLUSION,
            expert.id,
            SIGNED_EXTENSIONS,
        ) as documents:
            order.documents.extend(documents)
            order.result = result
            order.move_to(OrderStatus.SENT, Actor.EXPERT, f"Заключение {title}")
            await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            f"Эксперт отправил заключение ({title}). Скачайте его и примите работу",
        )

        return order
