from models.chat import ChatMessage
from models.user import User
from schemas.email import ChatMessageContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import full_name, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "chat_message"
SUBJECT = "Новое сообщение в чате — Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/chat/{chat_uuid}"
PREFERENCE_FIELD = "email_on_chat_message"
PREVIEW_MAX_LENGTH = 240


class SendChatMessageEmailUseCase:
    "Письмо о новом сообщении — только если получатель оффлайн (проверяется снаружи, до вызова)."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, message_id: int, recipient_online: bool) -> None:
        if recipient_online:
            return

        message = await self.repo.find_message(message_id)
        if message is None or message.chat is None:
            return

        recipient = self.resolve_recipient(message)
        if not self.dispatcher.can_send(recipient, PREFERENCE_FIELD):
            return

        context = self.build_context(message, recipient)
        self.dispatcher.dispatch(recipient.email, TEMPLATE, SUBJECT, context)

    @staticmethod
    def resolve_recipient(message: ChatMessage) -> User | None:
        chat = message.chat
        if chat is None:
            return None
        if message.sender_id == chat.customer_id:
            return chat.expert
        if message.sender_id == chat.expert_id:
            return chat.customer
        return None

    def build_context(self, message: ChatMessage, recipient: User) -> ChatMessageContext:
        chat = message.chat
        order = chat.order if chat else None
        order_title = (order.title if order else None) or "Заявка"
        sender_name = full_name(message.sender) or "Собеседник"

        preview = (message.text or "").strip()
        if len(preview) > PREVIEW_MAX_LENGTH:
            preview = preview[:PREVIEW_MAX_LENGTH] + "…"
        if not preview:
            preview = "(вложение или пустое сообщение)"

        return ChatMessageContext(
            recipient_greeting=greeting_for(recipient),
            sender_name=sender_name,
            order_title=order_title,
            message_preview=preview,
            cta_url=CTA_URL_TEMPLATE.format(chat_uuid=chat.uuid),
        )
