from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import get_current_user, require_user
from src.core.visitor import get_visitor_id
from src.poster.reactions.dependencies import (
    get_count_view_usecase,
    get_like_post_usecase,
    get_save_post_usecase,
    get_unlike_post_usecase,
    get_unsave_post_usecase,
)
from src.poster.reactions.schemas import LikesResponse
from src.poster.reactions.usecases.count_view import CountViewUseCase
from src.poster.reactions.usecases.like_post import LikePostUseCase
from src.poster.reactions.usecases.save_post import SavePostUseCase
from src.poster.reactions.usecases.unlike_post import UnlikePostUseCase
from src.poster.reactions.usecases.unsave_post import UnsavePostUseCase

router = APIRouter(prefix="/posts", tags=["Реакции"])


@router.post("/{post_id}/view", status_code=status.HTTP_204_NO_CONTENT)
async def count_view(
    post_id: int,
    user: Annotated[Account | None, Depends(get_current_user)],
    visitor_id: Annotated[str, Depends(get_visitor_id)],
    usecase: Annotated[CountViewUseCase, Depends(get_count_view_usecase)],
) -> None:
    """Засчитывает просмотр поста."""
    await usecase.execute(user=user, visitor_id=visitor_id, post_id=post_id)


@router.post("/{post_id}/like", response_model=LikesResponse)
async def like_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[LikePostUseCase, Depends(get_like_post_usecase)],
) -> LikesResponse:
    """Ставит лайк посту."""
    return await usecase.execute(user=user, post_id=post_id)


@router.delete("/{post_id}/like", response_model=LikesResponse)
async def unlike_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UnlikePostUseCase, Depends(get_unlike_post_usecase)],
) -> LikesResponse:
    """Снимает лайк с поста."""
    return await usecase.execute(user=user, post_id=post_id)


@router.post("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def save_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[SavePostUseCase, Depends(get_save_post_usecase)],
) -> None:
    """Сохраняет пост себе."""
    await usecase.execute(user=user, post_id=post_id)


@router.delete("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UnsavePostUseCase, Depends(get_unsave_post_usecase)],
) -> None:
    """Убирает пост из сохранённых."""
    await usecase.execute(user=user, post_id=post_id)
