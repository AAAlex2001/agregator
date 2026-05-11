from fastapi import UploadFile

from models.order import Order
from services.email import SendOrderUpdatedEmailUseCase
from services.email.changes import summarize_order_changes
from services.orders.documents import OrderDocumentsService
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.use_cases.update_order import UpdateOrderUseCase
from schemas.order import OrderDocuments, OrderUpdate


class UpdateOrderWithFilesUseCase:
    "Обновляет заказ и дозагружает файлы. Diff и письмо считаются один раз в конце."

    def __init__(
        self,
        update_order: UpdateOrderUseCase,
        get_order: GetOrderByIdUseCase,
        repo: OrderRepository,
        files: OrderFileStorage,
        send_updated_email: SendOrderUpdatedEmailUseCase | None = None,
    ):
        self.update_order = update_order
        self.get_order = get_order
        self.repo = repo
        self.files = files
        self.send_updated_email = send_updated_email

    async def execute(
        self,
        order_id: int,
        data: OrderUpdate,
        *,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
        current_user_id: int,
    ) -> Order:
        before = await self.get_order.execute(order_id)
        snapshot = self.snapshot(before)
        before_documents = OrderDocumentsService.from_order(before)

        order = await self.update_order.execute(
            order_id,
            data,
            current_user_id=current_user_id,
            notify=False,
        )

        if technical or contract or company or other:
            order = await self.append_files(
                order_id, order,
                technical=technical, contract=contract, company=company, other=other,
                before_documents=before_documents,
            )

        await self.send_email_if_changed(order, snapshot)
        return order

    @staticmethod
    def snapshot(order: Order) -> dict:
        return {
            "sum_amount": order.sum_amount,
            "deadline": order.deadline,
            "comment": order.comment or "",
            "files_count": OrderDocumentsService.count(OrderDocumentsService.from_order(order)),
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
            OrderDocumentsService.count(OrderDocumentsService.from_order(order)),
        )
        if not summary:
            return
        await self.send_updated_email.execute(order.id, summary)

    async def append_files(
        self,
        order_id: int,
        order: Order,
        *,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
        before_documents: OrderDocuments,
    ) -> Order:
        existing = OrderDocumentsService.from_order(order)
        saved = await self.files.save_documents(
            order_id,
            technical=technical,
            contract=contract,
            company=company,
            other=other,
        )
        combined = OrderDocumentsService.merge(existing, saved)
        no_previous = (
            order.previous_technical_files is None
            and order.previous_contract_files is None
            and order.previous_company_files is None
            and order.previous_other_files is None
        )
        if before_documents != combined and no_previous:
            OrderDocumentsService.write_previous(order, before_documents)
        OrderDocumentsService.write(order, combined)
        await self.repo.flush()
        return await self.get_order.execute(order_id)
