from models.response import OrderResponse, ResponseStatus
from schemas.response import ResponseCounters, ResponseTab
from services.responses.repository import ResponseRepository
from services.responses.tabs import statuses_for_tab
from services.responses.validators import ResponseValidator


class ListExpertResponsesUseCase:
    def __init__(self, repo: ResponseRepository, validator: ResponseValidator):
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        expert_id: int,
        tab: ResponseTab | None,
        skip: int,
        limit: int,
    ) -> tuple[list[OrderResponse], int, ResponseCounters]:
        await self.validator.ensure_expert(expert_id)
        status_filters = statuses_for_tab(tab)
        items, total = await self.repo.list_expert_responses(
            expert_id, status_filters, skip, limit
        )
        counters_map = await self.repo.expert_counters(expert_id)
        return items, total, self.build_counters(counters_map)

    @staticmethod
    def build_counters(counters_map: dict[ResponseStatus, int]) -> ResponseCounters:
        return ResponseCounters(
            all=sum(counters_map.values()),
            review=counters_map.get(ResponseStatus.REVIEW, 0),
            in_progress=counters_map.get(ResponseStatus.IN_PROGRESS, 0),
            rejected=counters_map.get(ResponseStatus.REJECTED, 0),
            accepted=counters_map.get(ResponseStatus.ACCEPTED, 0),
        )
