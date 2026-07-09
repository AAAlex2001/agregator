"Use case: create order with files."
from fastapi import UploadFile

from models.order import Order
from schemas.order import OrderCreate, OrderDocuments
from services.file_uploads import remove_uploaded_file
from services.orders.documents import OrderDocumentsService
from services.orders.document_copy import OrderDocumentCopyService
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.create_order import CreateOrderUseCase


class CreateOrderWithFilesUseCase:
    "Создаёт заказ и сразу прикрепляет файлы по 4 категориям."

    def __init__(
        self,
        create_order: CreateOrderUseCase,
        repo: OrderRepository,
        files: OrderFileStorage,
        document_copy: OrderDocumentCopyService | None = None,
    ) -> None:
        self.create_order = create_order
        self.repo = repo
        self.files = files
        self.document_copy = document_copy

    async def execute(
        self,
        data: OrderCreate,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
        current_user_id: int,
        copy_source_order_id: int | None = None,
        copy_documents: OrderDocuments | None = None,
    ) -> Order:
        "Запускает основной сценарий use case."
        order = await self.create_order.execute(data, current_user_id=current_user_id)

        copied = OrderDocuments()
        if copy_source_order_id is not None and copy_documents is not None:
            if self.document_copy is None:
                raise RuntimeError("Order document copy service is not configured")
            copied = await self.document_copy.copy_to(
                copy_source_order_id,
                order.id,
                copy_documents,
                current_user_id,
            )

        if not (technical or contract or company or other or OrderDocumentsService.count(copied)):
            return order

        saved = await self.files.save_documents(
            order.id,
            technical=technical,
            contract=contract,
            company=company,
            other=other,
        )
        try:
            OrderDocumentsService.write(order, OrderDocumentsService.merge(copied, saved))
            await self.repo.flush()
            reloaded = await self.repo.get_by_id(order.id)
        except Exception:
            self.remove_saved_documents(OrderDocumentsService.merge(copied, saved))
            raise
        if reloaded is None:
            raise RuntimeError("Order disappeared after insert")
        return reloaded

    @staticmethod
    def remove_saved_documents(saved: OrderDocuments) -> None:
        "Удаляет ресурс."
        for path in (*saved.technical, *saved.contract, *saved.company, *saved.other):
            remove_uploaded_file(path)
