"Use case: list archived orders."
from dataclasses import dataclass

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from services.orders.repository import OrderRepository


@dataclass
class ArchivedOrderItem:
    "Компонент сервисного слоя."
    order: Order
    accepted_response: OrderResponse | None
    has_review: bool


class ListArchivedOrdersUseCase:
    "Список архивных заказов с принятым откликом и отметкой об отзыве для текущего юзера."

    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        skip: int,
        limit: int,
        current_user_id: int,
    ) -> tuple[list[ArchivedOrderItem], bool]:
        "Запускает основной сценарий use case."
        orders, has_more = await self.repo.list_archived(skip, limit)

        accepted_by_order: dict[int, OrderResponse] = {}
        for order in orders:
            for response in order.responses:
                if order.assigned_expert_id is None:
                    continue
                if response.expert_id != order.assigned_expert_id:
                    continue
                if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                    continue
                accepted_by_order[order.id] = response
                break

        reviewed: set[int] = set()
        customer_orders = [o for o in orders if o.customer_id == current_user_id]
        if customer_orders:
            response_ids = [
                accepted_by_order[o.id].id
                for o in customer_orders
                if o.id in accepted_by_order
            ]
            if response_ids:
                reviewed = await self.repo.reviewed_response_ids(current_user_id, response_ids)

        items = []
        for order in orders:
            accepted = accepted_by_order.get(order.id)
            has_review = (
                order.customer_id == current_user_id
                and accepted is not None
                and accepted.id in reviewed
            )
            items.append(ArchivedOrderItem(
                order=order,
                accepted_response=accepted,
                has_review=has_review,
            ))
        return items, has_more
