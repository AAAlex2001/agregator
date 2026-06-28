"Use case: list experts map."
from services.experts.repository import ExpertLocationRow, ExpertsRepository


class ListExpertsMapUseCase:
    "Активные эксперты с координатами базирования — для карты при создании заказа."

    def __init__(self, repo: ExpertsRepository) -> None:
        self.repo = repo

    async def execute(self) -> list[ExpertLocationRow]:
        "Запускает основной сценарий use case."
        return await self.repo.list_with_location()
