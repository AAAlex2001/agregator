"Use case: delete rejected response."
from fastapi import HTTPException, status

from models.response import OrderResponse, ResponseStatus
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase


class DeleteRejectedResponseUseCase:
    "Заказчик навсегда удаляет один отклонённый отклик из своих списков."

    def __init__(self, repo: ResponseRepository, get_response: GetResponseByIdUseCase) -> None:
        self.repo = repo
        self.get_response = get_response

    async def execute(self, response_id: int, customer_id: int) -> None:
        "Запускает основной сценарий use case."
        response = await self.get_response.execute(response_id)
        self.ensure_owner(response, customer_id)
        self.ensure_rejected(response)
        await self.repo.delete(response)
        await self.repo.flush()

    @staticmethod
    def ensure_owner(response: OrderResponse, customer_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        order = response.order
        if order is not None and order.customer_id == customer_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя удалить чужой отклик",
        )

    @staticmethod
    def ensure_rejected(response: OrderResponse) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if response.status == ResponseStatus.REJECTED:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Удалить можно только отклонённый отклик",
        )


class DeleteAllRejectedResponsesUseCase:
    "Заказчик массово удаляет все свои отклонённые отклики."

    def __init__(self, repo: ResponseRepository) -> None:
        self.repo = repo

    async def execute(self, customer_id: int) -> int:
        "Запускает основной сценарий use case."
        responses = await self.repo.list_customer_rejected(customer_id)
        if not responses:
            return 0
        for response in responses:
            await self.repo.delete(response)
        await self.repo.flush()
        return len(responses)
