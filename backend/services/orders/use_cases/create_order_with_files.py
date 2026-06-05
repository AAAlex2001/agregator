from fastapi import UploadFile

from models.order import Order
from schemas.order import OrderCreate
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
    ):
        self.create_order = create_order
        self.repo = repo
        self.files = files

    async def execute(
        self,
        data: OrderCreate,
        *,
        technical: list[UploadFile],
        contract: list[UploadFile],
        company: list[UploadFile],
        other: list[UploadFile],
        current_user_id: int,
    ) -> Order:
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
        OrderDocumentsService.write(order, saved)
        await self.repo.flush()
        return await self.repo.get_by_id(order.id)
