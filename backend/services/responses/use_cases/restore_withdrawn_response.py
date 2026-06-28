"Use case: restore withdrawn response."
from fastapi import HTTPException, status

from models.order import OrderStatus
from models.response import OrderResponse, ResponseStatus
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.subscriptions import SubscriptionAccess


class RestoreWithdrawnResponseUseCase:
    "Возвращает отозванный экспертом отклик обратно в статус REVIEW и заново списывает слот разового тарифа."

    def __init__(
        self,
        repo: ResponseRepository,
        get_response: GetResponseByIdUseCase,
        subscription_access: SubscriptionAccess | None = None,
    ) -> None:
        self.repo = repo
        self.get_response = get_response
        self.subscription_access = subscription_access

    async def execute(self, response_id: int, expert_id: int) -> OrderResponse:
        "Запускает основной сценарий use case. Возврат отклика повторно расходует слот (как новый отклик)."
        response = await self.get_response.execute(response_id)
        self.ensure_owner(response, expert_id)
        self.ensure_withdrawn(response)
        self.ensure_order_open(response)

        subscription = None
        if self.subscription_access is not None:
            subscription = await self.subscription_access.require_for_response(expert_id)

        response.status = ResponseStatus.REVIEW
        response.auto_rejected = False
        await self.repo.flush()

        if subscription is not None and self.subscription_access is not None:
            await self.subscription_access.consume_for_response(subscription)

        return await self.get_response.execute(response_id)

    @staticmethod
    def ensure_owner(response: OrderResponse, expert_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if response.expert_id == expert_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя восстановить чужой отклик",
        )

    @staticmethod
    def ensure_withdrawn(response: OrderResponse) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if response.status == ResponseStatus.WITHDRAWN_BY_EXPERT:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Восстановить можно только отозванный отклик",
        )

    @staticmethod
    def ensure_order_open(response: OrderResponse) -> None:
        "Бросает HTTPException, если условие не выполнено."
        order = response.order
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Заказ не найден",
            )
        if order.status != OrderStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Заказ уже закрыт — отклик нельзя восстановить",
            )
        if order.assigned_expert_id is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="По заказу уже выбран исполнитель — отклик нельзя восстановить",
            )
