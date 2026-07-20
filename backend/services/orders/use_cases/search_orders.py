"Use case: search orders."
from models.order import Order, OrderWorkType
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
        work_type: OrderWorkType | None = None,
        badge_code: str | None = None,
    ) -> tuple[list[Order], bool]:
        "Запускает основной сценарий use case."
        normalized_query = (query or "").strip()
        normalized_badge = (badge_code or "").strip()
        if not normalized_query and work_type is None and not normalized_badge:
            return [], False
        return await self.repo.search_public(
            normalized_query,
            skip,
            limit,
            work_type=work_type,
            badge_code=normalized_badge or None,
        )
