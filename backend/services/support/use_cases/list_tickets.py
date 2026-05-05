from models.support_ticket import SupportTicket

from ..repository import SupportRepository


class ListUserTicketsUseCase:
    def __init__(self, repo: SupportRepository):
        self.repo = repo

    async def execute(
        self, user_id: int, skip: int, limit: int
    ) -> tuple[list[SupportTicket], int]:
        return await self.repo.list_for_user(user_id, skip, limit)
