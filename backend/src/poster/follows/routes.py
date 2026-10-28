from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.follows.dependencies import get_follow_author_usecase, get_unfollow_author_usecase
from src.poster.follows.usecases.follow_author import FollowAuthorUseCase
from src.poster.follows.usecases.unfollow_author import UnfollowAuthorUseCase

router = APIRouter(prefix="/posts/authors", tags=["Подписки"])


@router.post("/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def follow_author(
    author_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[FollowAuthorUseCase, Depends(get_follow_author_usecase)],
) -> None:
    """Подписывает меня на автора."""
    await usecase.execute(user=user, author_id=author_id)


@router.delete("/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_author(
    author_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UnfollowAuthorUseCase, Depends(get_unfollow_author_usecase)],
) -> None:
    """Отписывает меня от автора."""
    await usecase.execute(user=user, author_id=author_id)
