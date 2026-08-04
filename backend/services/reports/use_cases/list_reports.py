"Use case: list reports."
from dataclasses import dataclass

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from services.reports.repository import ReportRepository


@dataclass
class ReportListItem:
    "Компонент сервисного слоя."
    order: Order
    accepted_response: OrderResponse | None


def find_accepted_response(order: Order) -> OrderResponse | None:
    "Отклик принятого исполнителя по заказу (статус IN_PROGRESS либо COMPLETED)."
    if order.assigned_expert_id is None:
        return None
    for response in order.responses:
        if response.expert_id != order.assigned_expert_id:
            continue
        if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
            continue
        return response
    return None


class ListReportsUseCase:
    "Отчёты заказчика: завершённые заказы с принятым исполнителем."

    def __init__(self, repo: ReportRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        customer_id: int,
        skip: int,
        limit: int,
    ) -> tuple[list[ReportListItem], bool]:
        "Запускает основной сценарий use case."
        orders, has_more = await self.repo.list_for_customer(customer_id, skip, limit)
        items = [
            ReportListItem(order=order, accepted_response=find_accepted_response(order))
            for order in orders
        ]
        return items, has_more
