from dataclasses import dataclass

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from services.reports.repository import ReportRepository


@dataclass
class ReportListItem:
    order: Order
    accepted_response: OrderResponse | None


class ListReportsUseCase:
    "Отчёты заказчика: завершённые заказы с принятым исполнителем."

    def __init__(self, repo: ReportRepository):
        self.repo = repo

    async def execute(
        self,
        customer_id: int,
        skip: int,
        limit: int,
    ) -> tuple[list[ReportListItem], bool]:
        orders, has_more = await self.repo.list_for_customer(customer_id, skip, limit)
        items = [ReportListItem(order=order, accepted_response=self.find_accepted(order)) for order in orders]
        return items, has_more

    @staticmethod
    def find_accepted(order: Order) -> OrderResponse | None:
        if order.assigned_expert_id is None:
            return None
        for response in order.responses:
            if response.expert_id != order.assigned_expert_id:
                continue
            if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                continue
            return response
        return None
