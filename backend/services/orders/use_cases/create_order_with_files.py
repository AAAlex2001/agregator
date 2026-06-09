"Use case: create order with files."
from fastapi import UploadFile

from models.order import Order
from schemas.order import OrderCreate, OrderDocuments
from services.file_uploads import remove_uploaded_file
from services.orders.documents import OrderDocumentsService
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
    ) -> None:
        self.create_order = create_order
        self.repo = repo
        self.files = files

    async def execute(
        self,
        data: OrderCreate,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
        current_user_id: int,
    ) -> Order:
        "Запускает основной сценарий use case."
        order = await self.create_order.execute(data, current_user_id=current_user_id)

        if not (technical or contract or company or other):
            return order

        saved = await self.files.save_documents(
            order.id,
            technical=technical,
            contract=contract,
            company=company,
            other=other,
        )
        try:
            OrderDocumentsService.write(order, saved)
            await self.repo.flush()
            reloaded = await self.repo.get_by_id(order.id)
        except Exception:
            self.remove_saved_documents(saved)
            raise
        if reloaded is None:
            raise RuntimeError("Order disappeared after insert")
        return reloaded

    @staticmethod
    def remove_saved_documents(saved: OrderDocuments) -> None:
        "Удаляет ресурс."
        for path in (*saved.technical, *saved.contract, *saved.company, *saved.other):
            remove_uploaded_file(path)
