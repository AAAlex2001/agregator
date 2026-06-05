"Use case: get response by id."
from fastapi import HTTPException, status

from models.response import OrderResponse
from services.responses.repository import ResponseRepository


class GetResponseByIdUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ResponseRepository) -> None:
        self.repo = repo

    async def execute(self, response_id: int) -> OrderResponse:
        "Запускает основной сценарий use case."
        response = await self.repo.get_by_id(response_id)
        if response is not None:
            return response
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Отклик не найден",
        )
