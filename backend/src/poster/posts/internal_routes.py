from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from src.auth.internal.dependencies import require_internal_token
from src.poster.posts.dependencies import (
    get_delete_post_by_moderator_usecase,
    get_get_post_for_moderation_usecase,
    get_list_posts_for_moderation_usecase,
)
from src.poster.posts.models import PostStatus
from src.poster.posts.schemas import PostPageResponse, PostResponse
from src.poster.posts.usecases.delete_post_by_moderator import DeletePostByModeratorUseCase
from src.poster.posts.usecases.get_post_for_moderation import GetPostForModerationUseCase
from src.poster.posts.usecases.list_posts_for_moderation import ListPostsForModerationUseCase

router = APIRouter(
    prefix="/internal/posts",
    tags=["Модерация постов"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("", response_model=PostPageResponse)
async def list_posts(
    usecase: Annotated[ListPostsForModerationUseCase, Depends(get_list_posts_for_moderation_usecase)],
    post_status: Annotated[PostStatus, Query(alias="status")] = PostStatus.PUBLISHED,
    author_id: Annotated[int | None, Query(ge=1)] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> PostPageResponse:
    """Возвращает посты в одном статусе для модератора."""
    return await usecase.execute(status=post_status, author_id=author_id, limit=limit, offset=offset)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    usecase: Annotated[GetPostForModerationUseCase, Depends(get_get_post_for_moderation_usecase)],
) -> PostResponse:
    """Возвращает любой пост для модератора."""
    return await usecase.execute(post_id=post_id)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    usecase: Annotated[DeletePostByModeratorUseCase, Depends(get_delete_post_by_moderator_usecase)],
) -> None:
    """Удаляет пост, нарушающий правила."""
    await usecase.execute(post_id=post_id)
