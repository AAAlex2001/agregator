"Use case: list tickets."
from models.support_ticket import SupportTicket

from ..repository import SupportRepository


class ListUserTicketsUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: SupportRepository) -> None:
        self.repo = repo

    async def execute(
        self, user_id: int, skip: int, limit: int
    ) -> tuple[list[SupportTicket], bool]:
        "Запускает основной сценарий use case."
        return await self.repo.list_for_user(user_id, skip, limit)
