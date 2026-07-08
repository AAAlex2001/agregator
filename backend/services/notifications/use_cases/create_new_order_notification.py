"Use case: in-app уведомление о новой заявке экспертам с пересекающимся фильтром типов."
from models.notification import Notification, NotificationType
from models.order import Order
from schemas.notification import NewOrderNotificationPayload
from services.notifications.repository import NotificationRepository

ACTION_URL = "/expert/orders"
FALLBACK_MESSAGE = (
    "Заказ опубликован без указания направлений. "
    "Посмотрите карточку: возможно, он подходит вашему профилю."
)


class CreateNewOrderNotificationUseCase:
    "Рассылает in-app уведомление NEW_ORDER экспертам, у которых notify_order_types пересекается с бейджами заказа."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(self, order: Order, force_all_experts: bool = False) -> int:
        "Принимает уже загруженный заказ с badges. Возвращает число получателей."
        order_codes = {badge.text for badge in order.badges}
        fallback_to_all = force_all_experts or not order_codes

        experts = (
            await self.repo.list_all_experts()
            if fallback_to_all
            else await self.repo.list_experts_subscribed_to_order_types()
        )
        payload = NewOrderNotificationPayload(
            order_title=order.title or f"Заказ #{order.id}",
            badges=sorted(order_codes),
            message=FALLBACK_MESSAGE if fallback_to_all else "",
        )
        payload_dump = payload.model_dump(mode="json")

        sent = 0
        for expert in experts:
            wanted = set(expert.notify_order_types or [])
            if not fallback_to_all and not wanted & order_codes:
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
