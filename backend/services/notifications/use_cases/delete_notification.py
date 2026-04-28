from fastapi import HTTPException, status

from schemas.notification import NotificationMutationResponse
from services.notifications.repository import NotificationRepository


class DeleteNotificationUseCase:
    "Удаляет уведомление пользователя; если оно было непрочитанным — уменьшает счётчик."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(
        self, notification_id: int, user_id: int
    ) -> NotificationMutationResponse:
        was_read = await self.repo.delete(notification_id, user_id)
        if was_read is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Уведомление не найдено",
            )
        if not was_read:
            await self.repo.decrement_unread(user_id)
        await self.repo.flush()

        return NotificationMutationResponse(
            unread_count=await self.repo.get_unread_count(user_id),
            updated=1,
        )
