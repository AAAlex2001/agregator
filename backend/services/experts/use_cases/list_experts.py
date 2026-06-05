"Use case: list experts."
from services.experts.repository import ExpertsRepository, ExpertSummaryRow


class ListExpertsUseCase:
    "Карточки экспертов с агрегатами и последним заказом. Только эксперты с отзывами."

    def __init__(self, repo: ExpertsRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        skip: int,
        limit: int,
        query: str | None,
        sort_by: str,
        sort_dir: str,
    ) -> tuple[list[ExpertSummaryRow], bool]:
        "Запускает основной сценарий use case."
        return await self.repo.list_summaries(skip, limit, query, sort_by, sort_dir)
