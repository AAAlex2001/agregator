from fastapi import HTTPException, status

from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus
from services.email import SendExpertRejectedEmailUseCase
from services.responses.broadcaster import ResponseBroadcaster
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.subscriptions import SubscriptionAccess


WITHDRAWABLE_STATUSES = {
    ResponseStatus.REVIEW,
    ResponseStatus.ACCEPTED,
    ResponseStatus.IN_PROGRESS,
}
ASSIGNED_STATUSES = {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}


class WithdrawResponseUseCase:
    def __init__(
        self,
        repo: ResponseRepository,
        get_response: GetResponseByIdUseCase,
        in_app: ResponseInAppNotifier,
        broadcaster: ResponseBroadcaster,
        send_rejected_email: SendExpertRejectedEmailUseCase | None = None,
        subscription_access: SubscriptionAccess | None = None,
    ):
        self.repo = repo
        self.get_response = get_response
        self.in_app = in_app
        self.broadcaster = broadcaster
        self.send_rejected_email = send_rejected_email
        self.subscription_access = subscription_access

    async def execute(self, response_id: int, expert_id: int) -> int:
        response = await self.get_response.execute(response_id)
        self.ensure_owner(response, expert_id)
        self.ensure_withdrawable(response)

        order_id = response.order_id
        order = response.order
        customer_id = order.customer_id if order else None
        was_assigned = response.status in ASSIGNED_STATUSES

        self.release_assignment(response, expert_id)

        if was_assigned and self.send_rejected_email is not None:
            await self.send_rejected_email.execute(response_id)

        await self.repo.delete(response)
        await self.repo.flush()

        if self.subscription_access is not None:
            await self.subscription_access.restore_response_slot(expert_id)

        if customer_id is not None:
            await self.in_app.response_withdrawn(order_id, customer_id, order)

        refreshed = await self.repo.reload_order_with_relations(order_id)
        if refreshed and refreshed.assigned_expert_id is None:
            await self.broadcaster.order_reopened(refreshed)

        return order_id

    @staticmethod
    def ensure_owner(response: OrderResponse, expert_id: int) -> None:
        if response.expert_id == expert_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя отозвать чужой отклик",
        )

    @staticmethod
    def ensure_withdrawable(response: OrderResponse) -> None:
        if response.status in WITHDRAWABLE_STATUSES:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Отозвать можно только отклик на рассмотрении, принятый или в работе",
        )

    @staticmethod
    def release_assignment(response: OrderResponse, expert_id: int) -> None:
        order: Order | None = response.order
        if order is None or order.assigned_expert_id != expert_id:
            return
        order.assigned_expert_id = None
        if order.status != OrderStatus.ARCHIVED:
            order.status = OrderStatus.ACTIVE
