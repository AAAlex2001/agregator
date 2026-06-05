"Use case: mark notification read."
from datetime import UTC, datetime

from fastapi import HTTPException, status

from schemas.notification import NotificationMutationResponse
from services.notifications.formatters import to_response
from services.notifications.repository import NotificationRepository


class MarkNotificationReadUseCase:
    "Помечает одно уведомление как прочитанное и пересчитывает unread-счётчик."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self, notification_id: int, user_id: int
    ) -> NotificationMutationResponse:
        "Запускает основной сценарий use case."
        now = datetime.now(UTC)
        was_unread = await self.repo.mark_one_read(notification_id, user_id, now)
        if was_unread:
            await self.repo.decrement_unread(user_id)
        await self.repo.flush()

        notification = await self.repo.find_by_id_for_user(notification_id, user_id)
        if notification is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Уведомление не найдено",
            )

        return NotificationMutationResponse(
            unread_count=await self.repo.get_unread_count(user_id),
            updated=1 if was_unread else 0,
            item=to_response(notification),
        )
