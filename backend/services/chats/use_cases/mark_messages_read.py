from services.chats.repository import ChatRepository


class MarkMessagesReadUseCase:
    def __init__(self, repo: ChatRepository):
        self.repo = repo

    async def execute(self, chat_id: int, reader_id: int) -> list[int]:
        ids = await self.repo.unread_message_ids(chat_id, reader_id)
        await self.repo.mark_as_read(ids)
        return ids
