from fastapi import HTTPException, status

from models.support_ticket import SupportTicket

from ..repository import SupportRepository


class GetTicketForUserUseCase:
    def __init__(self, repo: SupportRepository):
        self.repo = repo

    async def execute(self, ticket_id: int, user_id: int) -> SupportTicket:
        ticket = await self.repo.get_for_user(ticket_id, user_id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Обращение не найдено",
            )

        if ticket.has_unread_for_user:
            ticket.has_unread_for_user = False
            await self.repo.flush()

        return ticket
