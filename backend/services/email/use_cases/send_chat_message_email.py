"Use case: send chat message email."
from models.account import Account
from models.chat import ChatMessage
from schemas.email import ChatMessageContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import full_name, greeting_for, labor_listing_title
from services.email.repository import EmailRepository

TEMPLATE = "chat_message"
SUBJECT = "Новое сообщение в чате — Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/chat/{chat_uuid}"
PREFERENCE_FIELD = "email_on_chat_message"
PREVIEW_MAX_LENGTH = 240
TG_CTA = "Чтобы перейти в чат, откройте приложение."


class SendChatMessageEmailUseCase:
    "Уведомление о новом сообщении — только если получатель оффлайн (проверяется снаружи, до вызова)."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, message_id: int, recipient_online: bool) -> None:
        "Запускает основной сценарий use case."
        if recipient_online:
            return

        message = await self.repo.find_message(message_id)
        if message is None or message.chat is None:
            return

        recipient = self.resolve_recipient(message)
        if recipient is None:
            return

        context = self.build_context(message, recipient)
        self.dispatcher.notify(recipient, PREFERENCE_FIELD, TEMPLATE, SUBJECT, context, TG_CTA)

    @staticmethod
    def resolve_recipient(message: ChatMessage) -> Account | None:
        "Публичный метод сервисного слоя."
        chat = message.chat
        if chat is None:
            return None
        if message.sender_id == chat.customer_id:
            return chat.expert
        if message.sender_id == chat.expert_id:
            return chat.customer
        return None

    def build_context(self, message: ChatMessage, recipient: Account) -> ChatMessageContext:
        "Строит объект из входных данных."
        chat = message.chat
        order = chat.order if chat else None
        labor = chat.labor_listing if chat else None
        labor_title = None
        if labor is not None:
            labor_title = labor_listing_title(labor.kind)
        order_title = (order.title if order else None) or labor_title or "Заявка"
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
