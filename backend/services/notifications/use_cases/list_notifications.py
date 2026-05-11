from schemas.notification import NotificationListResponse
from services.notifications.formatters import to_response
from services.notifications.repository import NotificationRepository


class ListNotificationsUseCase:
    "Постраничный список уведомлений пользователя + счётчики."

    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def execute(
        self, user_id: int, limit: int = 50, offset: int = 0
    ) -> NotificationListResponse:
        items, has_more = await self.repo.list_for_user(user_id, limit=limit, offset=offset)
        unread = await self.repo.get_unread_count(user_id)

        return NotificationListResponse(
            items=[to_response(item) for item in items],
            has_more=has_more,
            unread_count=unread,
        )
