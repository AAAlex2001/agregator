from models.chat import Chat
from models.order import OrderStatus
from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole
from services.email import SendBiddingFinishedEmailUseCase
from services.email.use_cases.send_bidding_finished_email import OUTCOME_LOST, OUTCOME_WON
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.status_rules import ResponseStatusRules
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.responses.validators import ResponseValidator
from services.subscriptions import SubscriptionAccess


class UpdateResponseStatusUseCase:
    "Смена статуса отклика с учётом ролевых правил и фан-аута статусов."

    def __init__(
        self,
        repo: ResponseRepository,
        validator: ResponseValidator,
        rules: ResponseStatusRules,
        get_response: GetResponseByIdUseCase,
        in_app: ResponseInAppNotifier,
        send_bidding_email: SendBiddingFinishedEmailUseCase | None = None,
        subscription_access: SubscriptionAccess | None = None,
    ):
        self.repo = repo
        self.validator = validator
        self.rules = rules
        self.get_response = get_response
        self.in_app = in_app
        self.send_bidding_email = send_bidding_email
        self.subscription_access = subscription_access

    async def execute(
        self,
        response_id: int,
        actor_id: int,
        new_status: ResponseStatus,
        reason: str | None = None,
    ) -> OrderResponse:
        actor = await self.validator.get_actor(actor_id)
        response = await self.get_response.execute(response_id)
        self.rules.check(actor, response, new_status)

        expert_was_confirmed = response.expert_confirmed or False
        auto_rejected_ids: list[int] = []
        reverted_ids: list[int] = []

        if actor.role == UserRole.EXPERT:
            self.apply_expert_transition(response, new_status)
        if actor.role == UserRole.CUSTOMER:
            auto_rejected_ids, reverted_ids = await self.apply_customer_transition(
                response, new_status
            )

        if new_status == ResponseStatus.REJECTED:
            response.rejection_reason = reason
        elif response.rejection_reason and new_status != ResponseStatus.REJECTED:
            response.rejection_reason = None      

        old_status = response.status
        response.status = new_status

        await self.repo.flush()

        await self.in_app.status_changed(
            response=response,
            actor=actor,
            old_status=old_status,
            new_status=new_status,
            expert_was_confirmed=expert_was_confirmed,
            auto_rejected_expert_ids=auto_rejected_ids,
            reverted_expert_ids=reverted_ids,
            rejection_reason=response.rejection_reason,
        )

        await self.send_bidding_emails_on_selection(
            actor, response, new_status, auto_rejected_ids
        )

        return await self.get_response.execute(response_id)

    async def send_bidding_emails_on_selection(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
        auto_rejected_ids: list[int],
    ) -> None:
        "Заказчик выбрал исполнителя: победителю — won, остальным откликнувшимся — lost."
        if self.send_bidding_email is None:
            return
        if actor.role != UserRole.CUSTOMER:
            return
        if new_status != ResponseStatus.IN_PROGRESS:
            return

        await self.send_bidding_email.execute(
            response.expert_id, response.order_id, OUTCOME_WON, response_id=response.id
        )
        for loser_id in auto_rejected_ids:
            await self.send_bidding_email.execute(loser_id, response.order_id, OUTCOME_LOST)

    @staticmethod
    def apply_expert_transition(response: OrderResponse, new_status: ResponseStatus) -> None:
        if new_status == ResponseStatus.IN_PROGRESS:
            response.expert_confirmed = True
        if new_status == ResponseStatus.COMPLETED and response.order:
            response.order.status = OrderStatus.ARCHIVED

    async def apply_customer_transition(
        self,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> tuple[list[int], list[int]]:
        auto_rejected_ids: list[int] = []
        reverted_ids: list[int] = []

        if new_status == ResponseStatus.COMPLETED and response.order:
            response.order.status = OrderStatus.ARCHIVED

        if new_status == ResponseStatus.IN_PROGRESS and response.order:
            response.order.assigned_expert_id = response.expert_id
            auto_rejected_ids = await self.auto_reject_siblings(response)

        if new_status == ResponseStatus.REJECTED and response.order:
            reverted_ids = await self.release_if_assigned(response)

        if new_status == ResponseStatus.REVIEW:
            response.auto_rejected = False

        if new_status in {ResponseStatus.IN_PROGRESS, ResponseStatus.ACCEPTED}:
            await self.ensure_chat_exists(response)

        return auto_rejected_ids, reverted_ids

    async def auto_reject_siblings(self, response: OrderResponse) -> list[int]:
        siblings = await self.repo.list_active_siblings(response.order_id, response.id)
        if not siblings:
            return []
        rejected_ids: list[int] = []
        for sibling in siblings:
            sibling.status = ResponseStatus.REJECTED
            sibling.auto_rejected = True
            rejected_ids.append(sibling.expert_id)
            if self.subscription_access is not None:
                await self.subscription_access.restore_response_slot(sibling.expert_id)
        return rejected_ids

    async def release_if_assigned(self, response: OrderResponse) -> list[int]:
        if response.order.assigned_expert_id != response.expert_id:
            return []
        response.order.assigned_expert_id = None
        if response.order.status != OrderStatus.ARCHIVED:
            response.order.status = OrderStatus.ACTIVE
        reverted = await self.revert_auto_rejections(response)
        response.auto_rejected = False
        return reverted

    async def revert_auto_rejections(self, response: OrderResponse) -> list[int]:
        reverted = await self.repo.list_auto_rejected(response.order_id, response.id)
        if not reverted:
            return []
        expert_ids: list[int] = []
        for item in reverted:
            item.status = ResponseStatus.REVIEW
            item.auto_rejected = False
            expert_ids.append(item.expert_id)
        return expert_ids

    async def ensure_chat_exists(self, response: OrderResponse) -> None:
        order = response.order
        if order is None:
            return
        existing = await self.repo.find_chat(order.id, order.customer_id, response.expert_id)
        if existing is not None:
            return
        await self.repo.add(
            Chat(
                order_id=order.id,
                customer_id=order.customer_id,
                expert_id=response.expert_id,
            )
        )

