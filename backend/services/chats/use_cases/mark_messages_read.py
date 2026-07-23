"Use case: mark messages read."
from services.chats.repository import ChatRepository


class MarkMessagesReadUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ChatRepository) -> None:
        self.repo = repo

    async def execute(self, chat_id: int, reader_id: int) -> list[int]:
        "Запускает основной сценарий use case."
        ids = await self.repo.unread_message_ids(chat_id, reader_id)
        await self.repo.mark_as_read(ids)
        await self.repo.mark_labor_response_as_read(chat_id, reader_id)
        return ids
