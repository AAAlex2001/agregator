"""Новое обращение в поддержку с первым сообщением и файлами."""

from fastapi import UploadFile

from app.support.models import SupportTicket, TicketCategory
from app.support.services.messages import user_message
from app.support.services.repo import SupportRepository
from app.support.services.storage import SupportFileStorage
from app.support.services.validators import validate_uploads
from models.account import Account


class CreateTicketUseCase:
    """Создаёт обращение, которое ждёт ответа поддержки."""

    def __init__(self, tickets: SupportRepository, storage: SupportFileStorage) -> None:
        self.tickets = tickets
        self.storage = storage

    async def execute(
        self,
        user: Account,
        subject: str,
        category: TicketCategory,
        text: str,
        files: list[UploadFile],
    ) -> SupportTicket:
        """Номер выдаётся по id. Обращение не записалось — файлы удаляются."""

        uploads = validate_uploads(files)
        ticket_id = await self.tickets.reserve_id()

        async with self.storage.saved(ticket_id, uploads) as attachments:
            message = user_message(user, text.strip(), attachments)
            ticket = SupportTicket(
                id=ticket_id,
                number=f"T-{ticket_id + 1000}",
                user_id=user.id,
                subject=subject.strip(),
                category=category,
                last_message_text=message.text,
                last_message_at=message.created_at,
                messages=[message],
            )
            await self.tickets.add(ticket)

        return ticket
