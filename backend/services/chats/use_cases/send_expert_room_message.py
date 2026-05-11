from fastapi import HTTPException, UploadFile, status

from models.chat import ExpertRoomMessage
from schemas.chat import ExpertRoomMessageOut, WsExpertRoomMessage
from services.chats.expert_room_file_storage import ExpertRoomFileStorage
from services.chats.expert_room_rate_limiter import ExpertRoomRateLimiter
from services.chats.expert_room_repository import ExpertRoomRepository
from services.chats.expert_room_validator import ExpertRoomValidator
from ws.expert_room_manager import expert_room_manager


class SendExpertRoomMessageUseCase:
    "Сохраняет сообщение и рассылает всем подключённым экспертам."

    def __init__(
        self,
        repo: ExpertRoomRepository,
        validator: ExpertRoomValidator,
        rate_limiter: ExpertRoomRateLimiter,
        file_storage: ExpertRoomFileStorage,
    ):
        self.repo = repo
        self.validator = validator
        self.rate_limiter = rate_limiter
        self.file_storage = file_storage

    async def execute(
        self,
        user_id: int,
        text: str,
        uploads: list[UploadFile] | None = None,
    ) -> ExpertRoomMessageOut:
        sender = await self.validator.require_expert(user_id)
        await self.validator.ensure_not_banned(user_id)
        self.rate_limiter.check(user_id)

        cleaned = text.strip()
        non_empty_uploads = [f for f in (uploads or []) if f and f.filename]

        if not cleaned and not non_empty_uploads:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Сообщение не может быть пустым",
            )

        attachments = await self.file_storage.save(non_empty_uploads) if non_empty_uploads else []

        message = ExpertRoomMessage(
            sender_id=user_id,
            text=cleaned,
            attachments=[a.model_dump() for a in attachments],
        )
        await self.repo.add_message(message)
        message.sender = sender
        dto = ExpertRoomMessageOut.from_db(message)

        await expert_room_manager.broadcast(WsExpertRoomMessage(data=dto))
        return dto
