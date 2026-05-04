from models.order import Order
from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole
from schemas.notification import ResponseStatusChangeReason, ResponseUpdateKind
from services.notifications import (
    CreateResponseStatusChangedNotificationUseCase,
    CreateResponseUpdatedNotificationUseCase,
    NotificationRepository,
)
from services.responses.repository import ResponseRepository

RESPONSES_ACTION_URL = "/responses"


class ResponseInAppNotifier:
    "Внутренние (in-app) уведомления по откликам — обёртка над двумя use case'ами уведомлений."

    def __init__(self, repo: ResponseRepository, notifications: NotificationRepository):
        self.repo = repo
        self.create_response_updated = CreateResponseUpdatedNotificationUseCase(notifications)
        self.create_status_changed = CreateResponseStatusChangedNotificationUseCase(notifications)

    @staticmethod
    def order_title(order: Order | None, order_id: int) -> str:
        if order and order.title:
            return order.title
        return f"Заказ #{order_id}"

    async def chat_action_url(self, response: OrderResponse) -> str:
        order = response.order
        if order is None:
            return RESPONSES_ACTION_URL
        chat = await self.repo.find_chat(
            response.order_id, order.customer_id, response.expert_id
        )
        if chat is None:
            return RESPONSES_ACTION_URL
        return f"/chat/{chat.uuid}"

    async def response_updated(
        self,
        response: OrderResponse,
        kind: ResponseUpdateKind = ResponseUpdateKind.UPDATED,
    ) -> None:
        order = response.order
        if order is None:
            return
        await self.create_response_updated.execute(
            user_id=order.customer_id,
            order_title=self.order_title(order, response.order_id),
            kind=kind,
            action_url=RESPONSES_ACTION_URL,
        )

    async def response_withdrawn(
        self, order_id: int, customer_id: int, order: Order | None
    ) -> None:
        await self.create_response_updated.execute(
            user_id=customer_id,
            order_title=self.order_title(order, order_id),
            kind=ResponseUpdateKind.WITHDRAWN,
            action_url=RESPONSES_ACTION_URL,
        )

    async def status_changed(
        self,
        response: OrderResponse,
        actor: User,
        old_status: ResponseStatus,
        new_status: ResponseStatus,
        expert_was_confirmed: bool,
        auto_rejected_expert_ids: list[int],
        reverted_expert_ids: list[int],
        rejection_reason: str | None = None,
    ) -> None:
        order = response.order
        if order is None:
            return

        title = self.order_title(order, response.order_id)
        chat_url = await self.chat_action_url(response)

        if actor.role == UserRole.CUSTOMER:
            await self.notify_customer_actions(
                response, order, actor, old_status, new_status,
                auto_rejected_expert_ids, reverted_expert_ids,
                title, chat_url, rejection_reason,
            )
            return
        if actor.role == UserRole.EXPERT:
            await self.notify_expert_actions(
                response, order, actor, old_status, new_status,
                expert_was_confirmed, title, chat_url,
            )

    async def notify_customer_actions(
        self,
        response: OrderResponse,
        order: Order,
        actor: User,
        old_status: ResponseStatus,
        new_status: ResponseStatus,
        auto_rejected_expert_ids: list[int],
        reverted_expert_ids: list[int],
        title: str,
        chat_url: str,
        rejection_reason: str | None = None,
    ) -> None:
        if new_status == ResponseStatus.ACCEPTED and old_status != ResponseStatus.ACCEPTED:
            await self.create_status_changed.execute(
                user_id=response.expert_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=chat_url,
            )

        if new_status == ResponseStatus.IN_PROGRESS and old_status != ResponseStatus.IN_PROGRESS:
            await self.create_status_changed.execute(
                user_id=response.expert_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=chat_url,
            )
            for rejected_expert_id in auto_rejected_expert_ids:
                await self.create_status_changed.execute(
                    user_id=rejected_expert_id,
                    order_title=title,
                    actor_role=actor.role,
                    status_from=old_status,
                    status_to=ResponseStatus.REJECTED,
                    reason=ResponseStatusChangeReason.SELECTED_ANOTHER,
                    action_url=RESPONSES_ACTION_URL,
                )

        if new_status == ResponseStatus.REJECTED and old_status != ResponseStatus.REJECTED:
            await self.create_status_changed.execute(
                user_id=response.expert_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=RESPONSES_ACTION_URL,
                rejection_reason=rejection_reason,
            )
            for reverted_expert_id in reverted_expert_ids:
                await self.create_status_changed.execute(
                    user_id=reverted_expert_id,
                    order_title=title,
                    actor_role=actor.role,
                    status_from=ResponseStatus.REJECTED,
                    status_to=ResponseStatus.REVIEW,
                    reason=ResponseStatusChangeReason.SELECTED_ANOTHER_REVERTED,
                    action_url=RESPONSES_ACTION_URL,
                )

        if new_status == ResponseStatus.COMPLETED and old_status != ResponseStatus.COMPLETED:
            await self.create_status_changed.execute(
                user_id=response.expert_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=RESPONSES_ACTION_URL,
            )

    async def notify_expert_actions(
        self,
        response: OrderResponse,
        order: Order,
        actor: User,
        old_status: ResponseStatus,
        new_status: ResponseStatus,
        expert_was_confirmed: bool,
        title: str,
        chat_url: str,
    ) -> None:
        if new_status == ResponseStatus.IN_PROGRESS and not expert_was_confirmed:
            await self.create_status_changed.execute(
                user_id=order.customer_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=chat_url,
            )

        if new_status == ResponseStatus.COMPLETED and old_status != ResponseStatus.COMPLETED:
            await self.create_status_changed.execute(
                user_id=order.customer_id,
                order_title=title,
                actor_role=actor.role,
                status_from=old_status,
                status_to=new_status,
                reason=ResponseStatusChangeReason.DIRECT_CHANGE,
                action_url=RESPONSES_ACTION_URL,
            )
