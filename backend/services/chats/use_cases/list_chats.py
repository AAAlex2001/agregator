"Use case: list chats."
from models.chat import Chat, ChatMessage
from models.user import User
from schemas.chat import ChatListItemResponse
from services.chats.formatters import ChatFormatter
from services.chats.repository import ChatRepository
from services.chats.validators import ChatValidator


class ListChatsUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ChatRepository, validator: ChatValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, actor_id: int) -> list[ChatListItemResponse]:
        "Запускает основной сценарий use case."
        actor = await self.validator.require_active_user(actor_id)
        chats = await self.repo.list_actor_chats(actor_id)
        if not chats:
            return []

        chat_ids = [chat.id for chat in chats]
        last_messages = await self.repo.last_messages_for(chat_ids)
        unread_counts = await self.repo.unread_counts_for(chat_ids, actor_id)

        return [
            self.build_item(chat, actor, last_messages, unread_counts)
            for chat in chats
        ]

    @staticmethod
    def build_item(
        chat: Chat,
        actor: User,
        last_messages: dict[int, ChatMessage],
        unread_counts: dict[int, int],
    ) -> ChatListItemResponse:
        "Строит объект из входных данных."
        counterpart = ChatFormatter.counterpart(actor.id, chat)
        last_message = last_messages.get(chat.id)
        return ChatListItemResponse(
            id=chat.id,
            uuid=str(chat.uuid),
            order_id=chat.order_id,
            counterpart_id=counterpart.id,
            counterpart_name=counterpart.display_name,
            counterpart_avatar_url=counterpart.avatar_url,
            last_message_text=ChatFormatter.last_message_text(last_message),
            last_message_sender_id=last_message.sender_id if last_message else None,
            last_message_at=last_message.created_at if last_message else None,
            unread_count=unread_counts.get(chat.id, 0),
            updated_at=chat.updated_at,
        )
