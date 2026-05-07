from schemas.notification import NotificationMutationResponse
from services.notifications.repository import NotificationRepository


class DeleteAllNotificationsUseCase:
    "Удаляет все уведомления пользователя и обнуляет счётчик непрочитанных."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(self, user_id: int) -> NotificationMutationResponse:
        deleted = await self.repo.delete_all(user_id)
        await self.repo.reset_unread(user_id)
        await self.repo.flush()

        return NotificationMutationResponse(unread_count=0, updated=deleted)
