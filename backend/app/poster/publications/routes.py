"""Свои публикации: создать, изменить, удалить."""

from fastapi import APIRouter, Depends, Query, status

from app.auth.sessions.dependencies import require_user
from app.poster.publications.dependencies import (
    get_create_post_usecase,
    get_delete_post_usecase,
    get_own_post,
    get_update_post_usecase,
)
from app.poster.publications.models import Post
from app.poster.publications.schemas import PostSaveSchema, PostSchema
from app.poster.publications.services.usecases.create_post import CreatePostUseCase
from app.poster.publications.services.usecases.delete_post import DeletePostUseCase
from app.poster.publications.services.usecases.update_post import UpdatePostUseCase
from models.account import Account

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostSaveSchema,
    user: Account = Depends(require_user),
    usecase: CreatePostUseCase = Depends(get_create_post_usecase),
) -> PostSchema:
    """Опубликовать пост или сохранить черновиком."""

    post = await usecase.execute(user=user, payload=payload)

    return PostSchema.model_validate(post)


@router.put("/{post_id}")
async def update_post(
    payload: PostSaveSchema,
    post: Post = Depends(get_own_post),
    usecase: UpdatePostUseCase = Depends(get_update_post_usecase),
) -> PostSchema:
    """Изменить свой пост. Репост изменить нельзя."""

    updated = await usecase.execute(post=post, payload=payload)

    return PostSchema.model_validate(updated)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    from_channels: bool = Query(False, description="Удалить и из Telegram-каналов"),
    post: Post = Depends(get_own_post),
    usecase: DeletePostUseCase = Depends(get_delete_post_usecase),
) -> None:
    """Удалить свой пост или репост, по желанию — и из Telegram."""

    await usecase.execute(post=post, from_channels=from_channels)
