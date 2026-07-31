"Use case: create ticket."
from datetime import UTC, datetime

from fastapi import HTTPException, UploadFile, status

from models.account import Account
from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketCategory,
    TicketMessageAuthor,
    TicketStatus,
)
from schemas.support import CreateTicketRequest
from services.file_uploads import remove_uploaded_file

from ..file_storage import SupportFileStorage
from ..repository import SupportRepository

TICKET_NUMBER_OFFSET = 1000


def build_ticket_number(ticket_id: int) -> str:
    "Строит объект из входных данных."
    return f"T-{ticket_id + TICKET_NUMBER_OFFSET}"


def author_name_from_user(user: Account) -> str:
    "Публичный метод сервисного слоя."
    parts = [user.first_name or "", user.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    return name or user.email or f"Account #{user.id}"


class CreateTicketUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: SupportRepository, files: SupportFileStorage) -> None:
        self.repo = repo
        self.files = files

    async def execute(
        self,
        user: Account,
        data: CreateTicketRequest,
        uploads: list[UploadFile],
    ) -> SupportTicket:
        "Запускает основной сценарий use case."
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        message = SupportTicketMessage(
            author_kind=TicketMessageAuthor.USER,
            author_user_id=user.id,
            author_name=author_name_from_user(user),
            text=data.message.strip(),
            attachments=[],
            created_at=datetime.now(UTC),
        )

        ticket = SupportTicket(
            number="",
            user_id=user.id,
            subject=data.subject.strip(),
            category=TicketCategory(data.category.value),
            status=TicketStatus.REVIEW,
            has_unread_for_user=False,
            has_unread_for_admin=True,
            last_message_text=message.text,
            last_message_at=message.created_at,
            messages=[message],
        )
        await self.repo.add(ticket)
        await self.repo.flush()

        ticket.number = build_ticket_number(ticket.id)
        saved_attachments = await self.files.save(ticket.id, uploads)
        try:
            message.attachments = saved_attachments
            await self.repo.flush()
        except Exception:
            for attachment in saved_attachments:
                remove_uploaded_file(attachment.get("url"))
            raise
        return ticket
