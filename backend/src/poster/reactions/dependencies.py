from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.notifications.repository import NotificationRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.posts.repository import PostRepository
from src.poster.reactions.repository import ReactionRepository
from src.poster.reactions.usecases.count_view import CountViewUseCase
from src.poster.reactions.usecases.like_post import LikePostUseCase
from src.poster.reactions.usecases.save_post import SavePostUseCase
from src.poster.reactions.usecases.unlike_post import UnlikePostUseCase
from src.poster.reactions.usecases.unsave_post import UnsavePostUseCase


def get_like_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> LikePostUseCase:
    """Собирает сценарий лайка."""
    notify = NotifyPostActivityUseCase(NotificationRepository(db), AccountRepository(db))

    return LikePostUseCase(ReactionRepository(db), PostRepository(db), notify)


def get_unlike_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UnlikePostUseCase:
    """Собирает сценарий снятия лайка."""
    return UnlikePostUseCase(ReactionRepository(db), PostRepository(db))


def get_save_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SavePostUseCase:
    """Собирает сценарий сохранения поста."""
    return SavePostUseCase(ReactionRepository(db), PostRepository(db))


def get_unsave_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UnsavePostUseCase:
    """Собирает сценарий удаления поста из сохранённых."""
    return UnsavePostUseCase(ReactionRepository(db))


def get_count_view_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CountViewUseCase:
    """Собирает сценарий подсчёта просмотра."""
    return CountViewUseCase(ReactionRepository(db), PostRepository(db))
