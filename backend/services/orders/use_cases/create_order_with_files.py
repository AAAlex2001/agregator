from fastapi import UploadFile

from models.order import Order
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.create_order import CreateOrderUseCase
from schemas.order import OrderCreate


class CreateOrderWithFilesUseCase:
    "Создаёт заказ и сразу прикрепляет файлы. Логика создания делегирована CreateOrderUseCase."

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
        uploads: list[UploadFile] | None,
    ) -> Order:
        order = await self.create_order.execute(data)

        if not uploads:
            return order

        order.technical_files = await self.files.save(order.id, uploads)
        await self.repo.flush()
        return await self.repo.get_by_id(order.id)
