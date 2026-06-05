"Use case: list expert orders history."
from fastapi import HTTPException, status

from services.experts.repository import ExpertOrderHistoryItem, ExpertsRepository


class ListExpertOrdersHistoryUseCase:
    "Архивные заказы конкретного эксперта (по его public_id). 404, если эксперта нет."

    def __init__(self, repo: ExpertsRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        public_id: str,
        skip: int,
        limit: int,
    ) -> tuple[list[ExpertOrderHistoryItem], bool]:
        "Запускает основной сценарий use case."
        expert_id = await self.repo.get_expert_id_by_public_id(public_id)
        if expert_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Эксперт не найден",
            )
        return await self.repo.list_orders_history(expert_id, skip, limit)
