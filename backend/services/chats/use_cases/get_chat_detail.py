"Use case: get chat detail."
from fastapi import HTTPException, status

from models.chat import Chat, ChatMessage
from models.order import OrderStatus
from models.user import User, UserRole
from schemas.chat import ChatBadgeResponse, ChatDetailResponse, ChatMessageResponse
from services.chats.formatters import ChatFormatter
from services.chats.repository import ChatRepository
from services.chats.validators import ChatValidator


class GetChatDetailUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ChatRepository, validator: ChatValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, chat_id: int, actor_id: int, limit: int
    ) -> ChatDetailResponse:
        "Запускает основной сценарий use case."
        actor = await self.validator.require_active_user(actor_id)
        chat = await self.require_chat(chat_id, actor_id)
        messages = await self.repo.chat_messages_tail(chat_id, limit)
        response_status = await self.repo.response_status_for(chat.order_id, chat.expert_id)
        return self.build_response(chat, actor, messages, response_status)

    async def require_chat(self, chat_id: int, actor_id: int) -> Chat:
        "Возвращает требуемую сущность или бросает 404."
        chat = await self.repo.find_chat_by_id_for_actor(chat_id, actor_id)
        if chat is not None:
            return chat
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден"
        )

    @staticmethod
    def build_response(
        chat: Chat,
        actor: User,
        messages: list[ChatMessage],
        response_status: str | None,
    ) -> ChatDetailResponse:
        "Строит объект из входных данных."
        counterpart = ChatFormatter.counterpart(actor.id, chat)
        labor = chat.labor_listing
        deal = chat.contact_deal
        is_wanted = labor is not None and labor.kind.value == "EXPERT_WANTED"
        labor_title = "Поиск эксперта в штат" if is_wanted else "Готов к трудовому договору"
        labor_date = labor.start_date.strftime("%d.%m.%Y") if labor and labor.start_date else ""
        labor_badges = [
            ChatBadgeResponse(
                text=" ".join(
                    str(cert.get(key, ""))
                    for key in ("area", "object", "category")
                    if cert.get(key)
                ),
                variant="GRAY",
            )
            for cert in (labor.certificates if labor else [])
        ]
        deal_closed = deal is not None and deal.status.value in {"CONTACTS_RELEASED", "CANCELED"}

        if deal is not None:
            context_public_id = deal.public_id
            context_title = "Доступ к контактам эксперта"
            context_company = ""
            context_date = deal.created_at.strftime("%d.%m.%Y")
            context_sum = ChatFormatter.format_sum(deal.price_kopecks)
        elif labor is not None:
            context_public_id = labor.public_id
            context_title = labor_title
            context_company = labor.region
            context_date = labor_date
            context_sum = ""
        else:
            context_public_id = chat.order.public_id if chat.order else ""
            context_title = chat.order.title if chat.order else f"Заказ #{chat.order_id}"
            context_company = chat.order.company if chat.order else ""
            context_date = chat.order.deadline.strftime("%d.%m.%Y") if chat.order else ""
            context_sum = ChatFormatter.format_sum(chat.order.sum_amount) if chat.order else ""

        order_closed = chat.order.status == OrderStatus.ARCHIVED if chat.order else False

        return ChatDetailResponse(
            id=chat.id,
            uuid=str(chat.uuid),
            order_id=chat.order_id,
            order_public_id=context_public_id,
            customer_id=chat.customer_id,
            expert_id=chat.expert_id,
            order_title=context_title,
            order_company=context_company,
            order_date=context_date,
            order_sum=context_sum,
            order_badges=[
                ChatBadgeResponse(text=badge.text, variant=badge.variant.value)
                for badge in (chat.order.badges if chat.order else [])
            ] or labor_badges,
            counterpart_id=counterpart.id,
            counterpart_name=counterpart.display_name,
            counterpart_avatar_url=counterpart.avatar_url,
            response_status=response_status,
            is_blocked=chat.is_blocked or order_closed or deal_closed,
            is_manually_blocked=chat.is_blocked,
            messages=[
                GetChatDetailUseCase.message_to_response(chat, message)
                for message in messages
            ],
        )

    @staticmethod
    def message_to_response(chat: Chat, message: ChatMessage) -> ChatMessageResponse:
        "Публичный метод сервисного слоя."
        sender_role = (
            UserRole.CUSTOMER.value
            if message.sender_id == chat.customer_id
            else UserRole.EXPERT.value
        )
        return ChatMessageResponse(
            id=message.id,
            chat_id=message.chat_id,
            sender_id=message.sender_id,
            sender_role=sender_role,
            text=message.text,
            file_url=message.file_url,
            file_name=message.file_name,
            attachments=ChatFormatter.build_attachments(message),
            is_read=message.is_read,
            created_at=message.created_at,
        )
