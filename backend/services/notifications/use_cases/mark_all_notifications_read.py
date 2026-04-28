from datetime import datetime, timezone

from schemas.notification import NotificationMutationResponse
from services.notifications.repository import NotificationRepository


class MarkAllNotificationsReadUseCase:
    "Помечает все непрочитанные уведомления пользователя как прочитанные."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(self, user_id: int) -> NotificationMutationResponse:
        now = datetime.now(timezone.utc)
        updated = await self.repo.mark_all_read(user_id, now)
        if updated:
            await self.repo.decrement_unread(user_id, amount=updated)
        await self.repo.flush()

        return NotificationMutationResponse(
            unread_count=await self.repo.get_unread_count(user_id),
            updated=updated,
        )
