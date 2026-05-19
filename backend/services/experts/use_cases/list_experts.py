from services.experts.repository import ExpertsRepository, ExpertSummaryRow


class ListExpertsUseCase:
    "Постраничный список карточек экспертов с опциональным поиском по имени."

    def __init__(self, repo: ExpertsRepository):
        self.repo = repo

    async def execute(
        self,
        skip: int,
        limit: int,
        query: str | None,
    ) -> tuple[list[ExpertSummaryRow], bool]:
        return await self.repo.list_summaries(skip, limit, query)
