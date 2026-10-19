"""Уведомления о реакциях на публикации: лайк, комментарий, ответ, репост, подписка."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)

ActivityNotifier = CreatePostActivityNotificationUseCase


def get_activity_notifier(db: AsyncSession = Depends(get_db)) -> ActivityNotifier:
    """Уведомления автору в кабинете. О своих действиях не сообщают."""

    return CreatePostActivityNotificationUseCase(NotificationRepository(db))
