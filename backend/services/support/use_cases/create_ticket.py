from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile, status

from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketCategory,
    TicketMessageAuthor,
    TicketStatus,
)
from models.user import User
from schemas.support import CreateTicketRequest

from ..file_storage import SupportFileStorage
from ..repository import SupportRepository


TICKET_NUMBER_OFFSET = 1000


def build_ticket_number(ticket_id: int) -> str:
    return f"T-{ticket_id + TICKET_NUMBER_OFFSET}"


def author_name_from_user(user: User) -> str:
    parts = [user.first_name or "", user.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    return name or user.email or f"User #{user.id}"


class CreateTicketUseCase:
    def __init__(self, repo: SupportRepository, files: SupportFileStorage):
        self.repo = repo
        self.files = files

    async def execute(
        self,
        user: User,
        data: CreateTicketRequest,
        uploads: list[UploadFile],
    ) -> SupportTicket:
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        ticket = SupportTicket(
            number="",
            user_id=user.id,
            subject=data.subject.strip(),
            category=TicketCategory(data.category.value),
            status=TicketStatus.REVIEW,
            has_unread_for_user=False,
            has_unread_for_admin=True,
        )
        await self.repo.add(ticket)
        await self.repo.flush()

        ticket.number = build_ticket_number(ticket.id)

        attachments = await self.files.save(ticket.id, uploads)

        message = SupportTicketMessage(
            ticket_id=ticket.id,
            author_kind=TicketMessageAuthor.USER,
            author_user_id=user.id,
            author_name=author_name_from_user(user),
            text=data.message.strip(),
            attachments=attachments,
            created_at=datetime.now(timezone.utc),
        )
        await self.repo.add_message(message)
        await self.repo.flush()

        reloaded = await self.repo.get_by_id(ticket.id)
        if reloaded is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось создать обращение",
            )
        return reloaded
