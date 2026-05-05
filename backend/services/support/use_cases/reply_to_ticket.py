from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile, status

from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketMessageAuthor,
    TicketStatus,
)
from models.user import User

from ..file_storage import SupportFileStorage
from ..repository import SupportRepository
from .create_ticket import author_name_from_user


class ReplyToTicketUseCase:
    "Ответ пользователя в существующий тикет."

    def __init__(self, repo: SupportRepository, files: SupportFileStorage):
        self.repo = repo
        self.files = files

    async def execute(
        self,
        ticket_id: int,
        user: User,
        text: str,
        uploads: list[UploadFile],
    ) -> SupportTicket:
        ticket = await self.repo.get_for_user(ticket_id, user.id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Обращение не найдено",
            )
        if ticket.status == TicketStatus.CLOSED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Обращение закрыто. Создайте новое.",
            )

        cleaned = text.strip()
        attachments = await self.files.save(ticket.id, uploads)

        if not cleaned and not attachments:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Введите сообщение или прикрепите файл",
            )

        message = SupportTicketMessage(
            ticket_id=ticket.id,
            author_kind=TicketMessageAuthor.USER,
            author_user_id=user.id,
            author_name=author_name_from_user(user),
            text=cleaned,
            attachments=attachments,
            created_at=datetime.now(timezone.utc),
        )
        await self.repo.add_message(message)

        ticket.status = TicketStatus.REVIEW
        ticket.has_unread_for_admin = True
        ticket.has_unread_for_user = False
        ticket.updated_at = datetime.now(timezone.utc)

        await self.repo.flush()

        reloaded = await self.repo.get_by_id(ticket.id)
        if reloaded is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось добавить сообщение",
            )
        return reloaded
