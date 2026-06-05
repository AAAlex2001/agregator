"Use case: get chat by uuid."
from fastapi import HTTPException, status

from models.chat import Chat
from services.chats.repository import ChatRepository
from services.chats.validators import ChatValidator


class GetChatByUuidUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ChatRepository, validator: ChatValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, chat_uuid: str, actor_id: int) -> Chat:
        "Запускает основной сценарий use case."
        parsed = self.validator.parse_uuid(chat_uuid)
        chat = await self.repo.find_chat_by_uuid_for_actor(parsed, actor_id)
        if chat is not None:
            return chat
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден"
        )
