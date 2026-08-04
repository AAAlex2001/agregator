"Use case: delete order."
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.validators import OrderValidator


class DeleteOrderUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(
        self,
        repo: OrderRepository,
        get_order: GetOrderByIdUseCase,
        validator: OrderValidator,
        files: OrderFileStorage,
    ) -> None:
        self.repo = repo
        self.get_order = get_order
        self.validator = validator
        self.files = files

    async def execute(self, order_id: int, current_user_id: int) -> int:
        "Запускает основной сценарий use case."
        await self.validator.ensure_user_can_modify_order(order_id, current_user_id)

        order = await self.get_order.execute(order_id)
        await self.repo.delete(order)
        await self.repo.flush()
        self.files.remove_dir(order_id)
        return order_id
