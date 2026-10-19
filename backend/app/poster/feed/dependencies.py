"""Ленты: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.feed.services.repo import FeedRepository
from app.poster.feed.services.usecases.load_following_feed import LoadFollowingFeedUseCase
from app.poster.feed.services.usecases.load_marks import LoadMarksUseCase
from app.poster.follows.dependencies import get_follow_repository
from app.poster.follows.services.repo import FollowRepository
from app.poster.reactions.dependencies import get_post_like_repository, get_post_save_repository
from app.poster.reactions.services.repo import PostLikeRepository, PostSaveRepository


def get_feed_repository(db: AsyncSession = Depends(get_db)) -> FeedRepository:
    """Ленты постов с сессией текущего запроса."""

    return FeedRepository(db)


def get_load_marks_usecase(
    likes: PostLikeRepository = Depends(get_post_like_repository),
    saves: PostSaveRepository = Depends(get_post_save_repository),
    follows: FollowRepository = Depends(get_follow_repository),
) -> LoadMarksUseCase:
    """Сценарий отметок того, кто смотрит."""

    return LoadMarksUseCase(likes, saves, follows)


def get_load_following_feed_usecase(
    feed: FeedRepository = Depends(get_feed_repository),
    follows: FollowRepository = Depends(get_follow_repository),
) -> LoadFollowingFeedUseCase:
    """Сценарий ленты подписок."""

    return LoadFollowingFeedUseCase(feed, follows)
