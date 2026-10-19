"""Просмотры, лайки и сохранения постов."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import get_current_user, require_user
from app.poster.publications.dependencies import get_published_post
from app.poster.publications.models import Post
from app.poster.reactions.dependencies import (
    get_count_view_usecase,
    get_like_post_usecase,
    get_post_save_repository,
    get_post_visitor,
)
from app.poster.reactions.schemas import LikesSchema
from app.poster.reactions.services.repo import PostSaveRepository
from app.poster.reactions.services.usecases.count_view import CountViewUseCase
from app.poster.reactions.services.usecases.like_post import LikePostUseCase
from models.account import Account

router = APIRouter()


@router.post("/{post_id}/view", status_code=status.HTTP_204_NO_CONTENT)
async def count_view(
    post: Post = Depends(get_published_post),
    visitor: str = Depends(get_post_visitor),
    user: Account | None = Depends(get_current_user),
    usecase: CountViewUseCase = Depends(get_count_view_usecase),
) -> None:
    """Засчитать просмотр. Один посетитель — один просмотр в сутки, автор не считается."""

    await usecase.execute(post=post, user=user, visitor=visitor)


@router.post("/{post_id}/like")
async def like_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: LikePostUseCase = Depends(get_like_post_usecase),
) -> LikesSchema:
    """Поставить лайк. Автору приходит уведомление."""

    return await usecase.execute(user=user, post=post, liked=True)


@router.delete("/{post_id}/like")
async def unlike_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: LikePostUseCase = Depends(get_like_post_usecase),
) -> LikesSchema:
    """Убрать лайк."""

    return await usecase.execute(user=user, post=post, liked=False)


@router.post("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def save_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    saves: PostSaveRepository = Depends(get_post_save_repository),
) -> None:
    """Сохранить пост себе."""

    await saves.add(user.id, post.id)


@router.delete("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    saves: PostSaveRepository = Depends(get_post_save_repository),
) -> None:
    """Убрать пост из сохранённого."""

    await saves.remove(user.id, post.id)
