from fastapi import UploadFile

from models.order import Order
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.validators import OrderValidator


class UploadOrderFilesUseCase:
    def __init__(
        self,
        repo: OrderRepository,
        get_order: GetOrderByIdUseCase,
        files: OrderFileStorage,
        validator: OrderValidator,
    ):
        self.repo = repo
        self.get_order = get_order
        self.files = files
        self.validator = validator

    async def execute(self, order_id: int, uploads: list[UploadFile]) -> Order:
        self.validator.ensure_files_present(uploads)
        order = await self.get_order.execute(order_id)

        new_paths = await self.files.save(order_id, uploads)
        order.technical_files = list(order.technical_files or []) + new_paths
        await self.repo.flush()

        return await self.get_order.execute(order_id)
