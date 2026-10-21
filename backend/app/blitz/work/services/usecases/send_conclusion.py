"""Исполнитель отправляет подписанное ЭЦП заключение или отчёт об аудите."""

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import SIGNED_EXTENSIONS, OrderFiles
from app.blitz.documents.services.validators import required_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, ConclusionResult, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from app.blitz.orders.services.wording import wording_for
from models.account import Account

RESULT_TITLES = {ConclusionResult.POSITIVE: "положительное", ConclusionResult.NEGATIVE: "отрицательное"}


def sent_note(order: BlitzOrder, result: ConclusionResult | None) -> str:
    """Запись в истории: исход заключения или отправленный отчёт."""

    if result is None:
        return f"{wording_for(order).result.capitalize()} отправлен"

    return f"Заключение {RESULT_TITLES[result]}"


class SendConclusionUseCase:
    """Файлы результата. ЭЦП ставится средством подписи исполнителя до загрузки.

    У экспертизы обязателен исход заключения, у аудита его нет.
    """

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        expert: Account,
        order: BlitzOrder,
        result: ConclusionResult | None,
        uploads: list[UploadFile],
    ) -> BlitzOrder:
        """Только после оплаты остатка. Без файла или исхода экспертизы — InvalidOrderError."""

        require_assigned(order, expert)
        wording = wording_for(order)
        require_status(order, OrderStatus.PAID, "Результат отправляют после оплаты остатка")

        if result is None and order.service != ServiceKind.AUDIT:
            raise InvalidOrderError("Укажите, положительное заключение или отрицательное")

        files = required_files(uploads, f"Приложите файл: {wording.result}")
        note = sent_note(order, result)

        async with self.files.saved(
            order.id,
            files,
            DocumentKind.CONCLUSION,
            expert.id,
            SIGNED_EXTENSIONS,
        ) as documents:
            order.documents.extend(documents)
            order.result = result
            order.move_to(OrderStatus.SENT, Actor.EXPERT, note)
            await self.orders.save()

        outcome = f" ({RESULT_TITLES[result]})" if result else ""
        await self.notifier.notify(
            order.customer,
            order,
            f"{wording.executor} отправил {wording.result}{outcome}. Скачайте его и примите работу",
        )

        return order
