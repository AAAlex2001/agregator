"Use case: list customer responses."
from typing import NamedTuple

from models.response import OrderResponse, ResponseStatus
from schemas.response import ResponseCounters, ResponseTab
from services.responses.repository import ResponseRepository
from services.responses.tabs import statuses_for_tab
from services.responses.validators import ResponseValidator


class CustomerResponseRow(NamedTuple):
    "Строка выдачи откликов заказчика: отклик и отметка об оставленном отзыве."
    response: OrderResponse
    has_review: bool


class ListCustomerResponsesUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ResponseRepository, validator: ResponseValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        customer_id: int,
        tab: ResponseTab | None,
        skip: int,
        limit: int,
        sort_by: str = "created_at",
        sort_dir: str = "desc",
    ) -> tuple[list[CustomerResponseRow], bool, ResponseCounters]:
        "Запускает основной сценарий use case."
        await self.validator.ensure_customer(customer_id)
        status_filters = statuses_for_tab(tab)
        items, has_more = await self.repo.list_customer_responses(
            customer_id, status_filters, skip, limit, sort_by, sort_dir
        )
        rows = await self.build_rows(customer_id, items)
        counters_map = await self.repo.customer_counters(customer_id)
        return rows, has_more, self.build_counters(counters_map)

    async def build_rows(
        self, customer_id: int, items: list[OrderResponse]
    ) -> list[CustomerResponseRow]:
        "Дополняет отклики отметкой, оставлен ли по ним отзыв заказчика."
        reviewed_ids = await self.repo.reviewed_response_ids(
            customer_id, [item.id for item in items]
        )
        return [CustomerResponseRow(item, item.id in reviewed_ids) for item in items]

    @staticmethod
    def build_counters(counters_map: dict[ResponseStatus, int]) -> ResponseCounters:
        "Строит объект из входных данных."
        return ResponseCounters(
            all=(
                counters_map.get(ResponseStatus.REVIEW, 0)
                + counters_map.get(ResponseStatus.ACCEPTED, 0)
                + counters_map.get(ResponseStatus.IN_PROGRESS, 0)
                + counters_map.get(ResponseStatus.REJECTED, 0)
            ),
            review=counters_map.get(ResponseStatus.REVIEW, 0),
            in_progress=counters_map.get(ResponseStatus.IN_PROGRESS, 0),
            rejected=counters_map.get(ResponseStatus.REJECTED, 0),
            accepted=counters_map.get(ResponseStatus.ACCEPTED, 0),
        )
