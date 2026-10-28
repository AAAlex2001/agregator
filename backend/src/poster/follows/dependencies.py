from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.notifications.repository import NotificationRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.follows.repository import FollowRepository
from src.poster.follows.usecases.follow_author import FollowAuthorUseCase
from src.poster.follows.usecases.unfollow_author import UnfollowAuthorUseCase


def get_follow_author_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> FollowAuthorUseCase:
    """Собирает сценарий подписки на автора."""
    notify = NotifyPostActivityUseCase(NotificationRepository(db), AccountRepository(db))

    return FollowAuthorUseCase(FollowRepository(db), AccountRepository(db), notify)


def get_unfollow_author_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UnfollowAuthorUseCase:
    """Собирает сценарий отписки от автора."""
    return UnfollowAuthorUseCase(FollowRepository(db))
