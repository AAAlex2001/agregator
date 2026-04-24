from models.chat import Chat
from models.user import UserRole
from services.chats.formatters import ChatFormatter
from services.notification import NotificationService


class ChatInAppNotifier:
    "In-app уведомления о новых сообщениях. Email-нотификация идёт отдельно от этого класса."

    def __init__(self, notifications: NotificationService):
        self.notifications = notifications

    async def new_message(
        self,
        chat: Chat,
        sender_id: int,
        text: str,
        attachments_count: int,
    ) -> None:
        recipient_id = self.recipient_for(chat, sender_id)
        order_title = self.order_title(chat)
        preview = ChatFormatter.notification_preview(text, attachments_count)
        sender_role = ChatFormatter.sender_role(chat, sender_id)
        await self.notifications.create_chat_message_notification(
            user_id=recipient_id,
            order_title=order_title,
            sender_role=sender_role,
            preview=preview,
            action_url=f"/chat/{chat.uuid}",
        )

    @staticmethod
    def recipient_for(chat: Chat, sender_id: int) -> int:
        if sender_id == chat.customer_id:
            return chat.expert_id
        return chat.customer_id

    @staticmethod
    def order_title(chat: Chat) -> str:
        if chat.order and chat.order.title:
            return chat.order.title
        return f"Заказ #{chat.order_id}"
