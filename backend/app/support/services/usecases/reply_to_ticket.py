"""Ответ пользователя в своё обращение."""

from fastapi import UploadFile

from app.support.models import SupportTicket, TicketStatus
from app.support.services.exceptions import TicketClosedError
from app.support.services.messages import user_message
from app.support.services.repo import SupportRepository
from app.support.services.storage import SupportFileStorage
from app.support.services.validators import validate_reply, validate_uploads
from models.account import Account


class ReplyToTicketUseCase:
    """Добавляет сообщение и возвращает обращение поддержке на рассмотрение."""

    def __init__(self, tickets: SupportRepository, storage: SupportFileStorage) -> None:
        self.tickets = tickets
        self.storage = storage

    async def execute(
        self,
        ticket: SupportTicket,
        user: Account,
        text: str,
        files: list[UploadFile],
    ) -> SupportTicket:
        """В закрытое — TicketClosedError. Ответ не записался — файлы удаляются."""

        if ticket.status == TicketStatus.CLOSED:
            raise TicketClosedError

        uploads = validate_uploads(files)
        text = validate_reply(text, uploads)

        async with self.storage.saved(ticket.id, uploads) as attachments:
            message = user_message(user, text, attachments)
            ticket.messages.append(message)
            ticket.status = TicketStatus.REVIEW
            ticket.has_unread_for_admin = True
            ticket.has_unread_for_user = False
            ticket.last_message_text = message.text
            ticket.last_message_at = message.created_at
            await self.tickets.save()

        return ticket
