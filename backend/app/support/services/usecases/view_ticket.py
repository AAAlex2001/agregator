"""Просмотр своего обращения."""

from app.support.models import SupportTicket
from app.support.services.repo import SupportRepository


class ViewTicketUseCase:
    """Отдаёт обращение и снимает отметку о новом ответе поддержки."""

    def __init__(self, tickets: SupportRepository) -> None:
        self.tickets = tickets

    async def execute(self, ticket: SupportTicket) -> SupportTicket:
        """Обращение, прочитанное пользователем."""

        if ticket.has_unread_for_user:
            ticket.has_unread_for_user = False
            await self.tickets.save()

        return ticket
