"Use case: search orders."
from models.order import Order
from services.orders.repository import OrderRepository


class SearchOrdersUseCase:
    "Публичный поиск по всем заказам платформы (любого статуса) — для лендинговой строки поиска."

    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        query: str | None,
        skip: int,
        limit: int,
        badge_code: str | None = None,
    ) -> tuple[list[Order], bool]:
        "Запускает основной сценарий use case."
        normalized_query = (query or "").strip()
        normalized_badge = (badge_code or "").strip()
        if not normalized_query and not normalized_badge:
            return [], False
        return await self.repo.search_public(
            normalized_query,
            skip,
            limit,
            badge_code=normalized_badge or None,
        )
