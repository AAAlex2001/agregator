"""Администратор удаляет заявку вместе с файлами."""

from app.blitz.documents.services.storage import OrderFiles
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.repo import OrderRepository


class DeleteOrderUseCase:
    """Строки уходят каскадом, файлы удаляются с диска."""

    def __init__(self, orders: OrderRepository, files: OrderFiles) -> None:
        self.orders = orders
        self.files = files

    async def execute(self, order: BlitzOrder) -> None:
        """Удалить заявку."""

        documents = list(order.documents)
        await self.orders.delete(order)
        self.files.remove(documents)
