"Use case: list expert room messages."
from schemas.chat import ExpertRoomHistoryResponse, ExpertRoomMessageOut
from services.chats.expert_room_repository import ExpertRoomRepository
from services.chats.expert_room_validator import ExpertRoomValidator


class ListExpertRoomMessagesUseCase:
    "История общего чата экспертов с курсорной пагинацией по before_id."

    def __init__(self, repo: ExpertRoomRepository, validator: ExpertRoomValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, user_id: int, before_id: int | None, limit: int
    ) -> ExpertRoomHistoryResponse:
        "Запускает основной сценарий use case."
        await self.validator.require_expert(user_id)
        rows = await self.repo.list_messages(before_id, limit)
        has_more = len(rows) > limit
        items = [ExpertRoomMessageOut.from_db(m) for m in rows[:limit]]
        items.reverse()

        ban = await self.repo.find_ban(user_id) if before_id is None else None
        return ExpertRoomHistoryResponse(
            items=items,
            has_more=has_more,
            banned=ban is not None,
            ban_reason=(ban.reason or None) if ban is not None else None,
        )
