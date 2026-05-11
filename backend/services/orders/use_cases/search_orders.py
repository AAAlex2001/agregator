from models.order import Order
from services.orders.repository import OrderRepository


class SearchOrdersUseCase:
    "Публичный поиск по всем заказам платформы (любого статуса) — для лендинговой строки поиска."

    def __init__(self, repo: OrderRepository):
        self.repo = repo

    async def execute(self, query: str, skip: int, limit: int) -> tuple[list[Order], bool]:
        if not query.strip():
            return [], False
        return await self.repo.search_public(query, skip, limit)
