from fastapi import HTTPException, status

from services.experts.repository import ExpertsRepository, ExpertSummaryRow


class GetExpertSummaryUseCase:
    "Карточка одного эксперта по public_id. 404, если не найден."

    def __init__(self, repo: ExpertsRepository):
        self.repo = repo

    async def execute(self, public_id: str) -> ExpertSummaryRow:
        summary = await self.repo.get_summary(public_id)
        if summary is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Эксперт не найден",
            )
        return summary
