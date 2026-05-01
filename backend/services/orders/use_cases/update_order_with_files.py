from fastapi import UploadFile

from models.order import Order
from services.email import SendOrderUpdatedEmailUseCase
from services.email.changes import summarize_order_changes
from services.orders.broadcaster import OrderBroadcaster
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.use_cases.update_order import UpdateOrderUseCase
from schemas.order import OrderUpdate


class UpdateOrderWithFilesUseCase:
    "Обновляет заказ и дозагружает файлы. Считает общий diff и шлёт письмо один раз в конце."

    def __init__(
        self,
        update_order: UpdateOrderUseCase,
        get_order: GetOrderByIdUseCase,
        repo: OrderRepository,
        files: OrderFileStorage,
        broadcaster: OrderBroadcaster,
        send_updated_email: SendOrderUpdatedEmailUseCase | None = None,
    ):
        self.update_order = update_order
        self.get_order = get_order
        self.repo = repo
        self.files = files
        self.broadcaster = broadcaster
        self.send_updated_email = send_updated_email

    async def execute(
        self,
        order_id: int,
        data: OrderUpdate,
        uploads: list[UploadFile] | None,
        current_user_id: int,
    ) -> Order:
        before = await self.get_order.execute(order_id)
        snapshot = self.snapshot(before)

        order = await self.update_order.execute(
            order_id,
            data,
            current_user_id=current_user_id,
            notify=False,
        )

        if uploads:
            order = await self.append_files(order_id, order, uploads)

        await self.broadcaster.order_updated(order)
        await self.send_email_if_changed(order, snapshot)
        return order

    @staticmethod
    def snapshot(order: Order) -> dict:
        return {
            "sum_amount": order.sum_amount,
            "deadline": order.deadline,
            "comment": order.comment or "",
            "files_count": len(order.technical_files or []),
        }

    async def send_email_if_changed(self, order: Order, before: dict) -> None:
        if self.send_updated_email is None:
            return
        summary = summarize_order_changes(
            before["sum_amount"],
            order.sum_amount,
            before["deadline"],
            order.deadline,
            before["comment"],
            order.comment or "",
            before["files_count"],
            len(order.technical_files or []),
        )
        if not summary:
            return
        await self.send_updated_email.execute(order.id, summary)

    async def append_files(
        self,
        order_id: int,
        order: Order,
        uploads: list[UploadFile],
    ) -> Order:
        new_paths = await self.files.save(order_id, uploads)
        order.technical_files = list(order.technical_files or []) + new_paths
        await self.repo.flush()
        return await self.get_order.execute(order_id)
