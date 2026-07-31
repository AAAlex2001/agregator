"Use case: in-app уведомление о новой заявке экспертам с пересекающимся фильтром типов."
from models.notification import Notification, NotificationType
from models.order import Order, OrderWorkType
from schemas.notification import NewOrderNotificationPayload
from services.notifications.repository import NotificationRepository
from services.order_notification_types import notification_types_for_order

ACTION_URL = "/expert/orders"
FALLBACK_MESSAGE = (
    "Заказ опубликован без указания направлений. "
    "Посмотрите карточку: возможно, он подходит вашему профилю."
)


class CreateNewOrderNotificationUseCase:
    "Рассылает NEW_ORDER экспертам, чей фильтр пересекается с направлениями заказа."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(self, order: Order, force_all_experts: bool = False) -> int:
        "Принимает уже загруженный заказ с badges. Возвращает число получателей."
        order_types = notification_types_for_order(order)
        fallback_to_all = force_all_experts or (
            order.work_type == OrderWorkType.EXPERTISE and not order_types
        )

        experts = (
            await self.repo.list_all_experts()
            if fallback_to_all
            else await self.repo.list_experts_subscribed_to_order_types()
        )
        payload = NewOrderNotificationPayload(
            order_title=order.title or f"Заказ #{order.id}",
            badges=sorted(order_types) if order.work_type == OrderWorkType.EXPERTISE else [],
            message=FALLBACK_MESSAGE if fallback_to_all else "",
        )
        payload_dump = payload.model_dump(mode="json")

        sent = 0
        for expert in experts:
            profile = expert.expert_profile
            wanted = set(profile.notify_order_types or []) if profile else set()
            if not fallback_to_all and not wanted & order_types:
                continue
            notification = Notification(
                user_id=expert.id,
                type=NotificationType.NEW_ORDER,
                payload=payload_dump,
                action_url=ACTION_URL,
            )
            await self.repo.add(notification)
            await self.repo.increment_unread(expert.id)
            sent += 1
        await self.repo.flush()
        return sent
