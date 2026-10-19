"""Подписка на автора и отписка."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import require_user
from app.poster.follows.dependencies import (
    get_author,
    get_follow_author_usecase,
    get_follow_repository,
)
from app.poster.follows.services.repo import FollowRepository
from app.poster.follows.services.usecases.follow_author import FollowAuthorUseCase
from models.account import Account

router = APIRouter()


@router.post("/authors/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def follow_author(
    author: Account = Depends(get_author),
    user: Account = Depends(require_user),
    usecase: FollowAuthorUseCase = Depends(get_follow_author_usecase),
) -> None:
    """Подписаться на автора."""

    await usecase.execute(user=user, author=author)


@router.delete("/authors/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_author(
    author_id: int,
    user: Account = Depends(require_user),
    follows: FollowRepository = Depends(get_follow_repository),
) -> None:
    """Отписаться от автора."""

    await follows.remove(user.id, author_id)
