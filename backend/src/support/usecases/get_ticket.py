from src.accounts.models import Account
from src.support.exceptions import TicketNotFoundError
from src.support.repository import TicketRepository
from src.support.schemas import TicketDetailResponse


class GetTicketUseCase:
    """Просмотр своего обращения."""

    def __init__(self, tickets: TicketRepository) -> None:
        """Принимает репозиторий обращений."""
        self.tickets = tickets

    async def execute(self, *, user: Account, ticket_id: int) -> TicketDetailResponse:
        """Возвращает обращение с перепиской и снимает отметку о новом ответе поддержки."""
        ticket = await self.tickets.get_for_user(ticket_id, user.id)

        if ticket is None:
            raise TicketNotFoundError()

        if ticket.has_unread_for_user:
            ticket.has_unread_for_user = False
            await self.tickets.save()

        return TicketDetailResponse.from_ticket(ticket)
