from models.response import OrderResponse, ResponseStatus
from schemas.response import ResponseCounters, ResponseTab
from services.responses.repository import ResponseRepository
from services.responses.tabs import statuses_for_tab
from services.responses.validators import ResponseValidator


class ListCustomerResponsesUseCase:
    def __init__(self, repo: ResponseRepository, validator: ResponseValidator):
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
    ) -> tuple[list[OrderResponse], bool, ResponseCounters]:
        await self.validator.ensure_customer(customer_id)
        status_filters = statuses_for_tab(tab)
        items, has_more = await self.repo.list_customer_responses(
            customer_id, status_filters, skip, limit, sort_by, sort_dir
        )
        if items:
            await self.mark_reviewed(customer_id, items)
        counters_map = await self.repo.customer_counters(customer_id)
        return items, has_more, self.build_counters(counters_map)

    async def mark_reviewed(self, customer_id: int, items: list[OrderResponse]) -> None:
        response_ids = [item.id for item in items]
        reviewed_ids = await self.repo.reviewed_response_ids(customer_id, response_ids)
        for item in items:
            item.has_review_for_customer = item.id in reviewed_ids

    @staticmethod
    def build_counters(counters_map: dict[ResponseStatus, int]) -> ResponseCounters:
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
