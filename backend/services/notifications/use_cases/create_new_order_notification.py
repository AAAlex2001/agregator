"Use case: in-app уведомление о новой заявке экспертам с пересекающимся фильтром типов."
from models.notification import Notification, NotificationType
from models.order import Order
from schemas.notification import NewOrderNotificationPayload
from services.notifications.repository import NotificationRepository

ACTION_URL = "/expert/orders"


class CreateNewOrderNotificationUseCase:
    "Рассылает in-app уведомление NEW_ORDER экспертам, у которых notify_order_types пересекается с бейджами заказа."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(self, order: Order) -> int:
        "Принимает уже загруженный заказ с badges. Возвращает число получателей."
        order_codes = {badge.text for badge in order.badges}
        if not order_codes:
            return 0

        experts = await self.repo.list_experts_subscribed_to_order_types()
        payload = NewOrderNotificationPayload(
            order_title=order.title or f"Заказ #{order.id}",
            badges=sorted(order_codes),
        )
        payload_dump = payload.model_dump(mode="json")

        visible_ids = set(order.visible_expert_ids or [])
        sent = 0
        for expert in experts:
            if visible_ids and expert.id not in visible_ids:
                continue
            wanted = set(expert.notify_order_types or [])
            if not wanted & order_codes:
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
