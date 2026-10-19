"""Репосты: фабрика сценария."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.notifications import ActivityNotifier, get_activity_notifier
from app.poster.publications.dependencies import get_post_repository
from app.poster.publications.services.repo import PostRepository
from app.poster.reposts.services.repo import RepostRepository
from app.poster.reposts.services.usecases.create_repost import CreateRepostUseCase


def get_create_repost_usecase(
    db: AsyncSession = Depends(get_db),
    posts: PostRepository = Depends(get_post_repository),
    notify: ActivityNotifier = Depends(get_activity_notifier),
) -> CreateRepostUseCase:
    """Сценарий репоста."""

    return CreateRepostUseCase(posts, RepostRepository(db), notify)
