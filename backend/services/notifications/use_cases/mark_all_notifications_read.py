"Use case: mark all notifications read."
from datetime import UTC, datetime

from schemas.notification import NotificationMutationResponse
from services.notifications.repository import NotificationRepository


class MarkAllNotificationsReadUseCase:
    "Помечает все непрочитанные уведомления пользователя как прочитанные."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(self, user_id: int) -> NotificationMutationResponse:
        "Запускает основной сценарий use case."
        now = datetime.now(UTC)
        updated = await self.repo.mark_all_read(user_id, now)
        if updated:
            await self.repo.decrement_unread(user_id, amount=updated)
        await self.repo.flush()

        return NotificationMutationResponse(
            unread_count=await self.repo.get_unread_count(user_id),
            updated=updated,
        )
