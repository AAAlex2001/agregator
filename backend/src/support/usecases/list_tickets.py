from src.accounts.models import Account
from src.support.repository import TicketRepository
from src.support.schemas import TicketListResponse, TicketResponse


class ListTicketsUseCase:
    """Список своих обращений."""

    def __init__(self, tickets: TicketRepository) -> None:
        """Принимает репозиторий обращений."""
        self.tickets = tickets

    async def execute(self, *, user: Account, skip: int, limit: int) -> TicketListResponse:
        """Возвращает страницу обращений и есть ли следующая."""
        tickets = await self.tickets.list_for_user(user.id, skip, limit + 1)

        return TicketListResponse(
            items=[TicketResponse.from_ticket(ticket) for ticket in tickets[:limit]],
            has_more=len(tickets) > limit,
        )
