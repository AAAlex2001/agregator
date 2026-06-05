"Use case: block chat."
from fastapi import HTTPException, status

from models.chat import Chat
from services.chats.repository import ChatRepository


class BlockChatUseCase:
    "Блокирует чат."

    def __init__(
        self,
        repo: ChatRepository,
    ) -> None:
        self.repo = repo

    async def execute(self, chat_id: int, actor_id: int) -> Chat:
        "Запускает основной сценарий use case."
        chat = await self.repo.find_chat_by_id_for_actor(chat_id, actor_id)
        if chat is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден"
            )
        if chat.customer_id != actor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Заблокировать чат может только заказчик",
            )
        await self.repo.block_chat(chat_id)
        chat.is_blocked = True
        return chat
