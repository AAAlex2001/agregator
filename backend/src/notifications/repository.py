from sqlalchemy.ext.asyncio import AsyncSession

from src.notifications.models import Notification


class NotificationRepository:
    """Записывает уведомления в личный кабинет."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def add(self, notification: Notification) -> None:
        """Сохраняет новое уведомление в базе."""
        self.db.add(notification)
        await self.db.flush()
