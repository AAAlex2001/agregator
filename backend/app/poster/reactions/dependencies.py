"""Реакции на пост: репозитории, фабрики сценариев и ключ того, кто смотрит."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import get_current_user
from app.core.database import get_db
from app.core.visitor import get_visitor_key, interaction_key
from app.poster.notifications import ActivityNotifier, get_activity_notifier
from app.poster.reactions.services.repo import (
    PostLikeRepository,
    PostSaveRepository,
    PostViewRepository,
)
from app.poster.reactions.services.usecases.count_view import CountViewUseCase
from app.poster.reactions.services.usecases.like_post import LikePostUseCase
from models.account import Account


def get_post_like_repository(db: AsyncSession = Depends(get_db)) -> PostLikeRepository:
    """Лайки постов."""

    return PostLikeRepository(db)


def get_post_save_repository(db: AsyncSession = Depends(get_db)) -> PostSaveRepository:
    """Сохранённые посты."""

    return PostSaveRepository(db)


def get_like_post_usecase(
    likes: PostLikeRepository = Depends(get_post_like_repository),
    notify: ActivityNotifier = Depends(get_activity_notifier),
) -> LikePostUseCase:
    """Сценарий лайка поста."""

    return LikePostUseCase(likes, notify)


def get_count_view_usecase(db: AsyncSession = Depends(get_db)) -> CountViewUseCase:
    """Сценарий просмотра поста."""

    return CountViewUseCase(PostViewRepository(db))


def get_post_visitor(
    user: Account | None = Depends(get_current_user),
    visitor_key: str = Depends(get_visitor_key),
) -> str:
    """Кто смотрит пост: вошедший — по аккаунту, гость — по cookie посетителя."""

    user_id = user.id if user else None

    return interaction_key(user_id, visitor_key)
