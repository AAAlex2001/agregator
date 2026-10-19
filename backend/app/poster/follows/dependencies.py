"""Подписки: репозиторий, фабрика сценария и автор по id из пути."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.follows.services.exceptions import AuthorNotFoundError
from app.poster.follows.services.repo import FollowRepository
from app.poster.follows.services.usecases.follow_author import FollowAuthorUseCase
from app.poster.notifications import ActivityNotifier, get_activity_notifier
from models.account import Account


def get_follow_repository(db: AsyncSession = Depends(get_db)) -> FollowRepository:
    """Подписки на авторов."""

    return FollowRepository(db)


def get_follow_author_usecase(
    follows: FollowRepository = Depends(get_follow_repository),
    notify: ActivityNotifier = Depends(get_activity_notifier),
) -> FollowAuthorUseCase:
    """Сценарий подписки."""

    return FollowAuthorUseCase(follows, notify)


async def get_author(
    author_id: int,
    follows: FollowRepository = Depends(get_follow_repository),
) -> Account:
    """Действующий автор. Нет или отключён — 404."""

    author = await follows.get_author(author_id)
    if author is None or not author.is_active:
        raise AuthorNotFoundError

    return author
