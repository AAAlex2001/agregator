"Use case: reply to ticket."
from datetime import UTC, datetime

from fastapi import HTTPException, UploadFile, status

from models.account import Account
from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketMessageAuthor,
    TicketStatus,
)

from ..file_storage import SupportFileStorage
from ..repository import SupportRepository
from .create_ticket import author_name_from_user


class ReplyToTicketUseCase:
    "Ответ пользователя в существующий тикет."

    def __init__(self, repo: SupportRepository, files: SupportFileStorage) -> None:
        self.repo = repo
        self.files = files

    async def execute(
        self,
        ticket_id: int,
        user: Account,
        text: str,
        uploads: list[UploadFile],
    ) -> SupportTicket:
        "Запускает основной сценарий use case."
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
            author_kind=TicketMessageAuthor.USER,
            author_user_id=user.id,
            author_name=author_name_from_user(user),
            text=cleaned,
            attachments=attachments,
            created_at=datetime.now(UTC),
        )
        ticket.messages.append(message)

        ticket.status = TicketStatus.REVIEW
        ticket.has_unread_for_admin = True
        ticket.has_unread_for_user = False
        ticket.last_message_text = message.text
        ticket.last_message_at = message.created_at
        ticket.updated_at = datetime.now(UTC)

        await self.repo.flush()
        return ticket
