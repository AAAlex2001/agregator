from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import get_current_user, require_user
from src.poster.comments.dependencies import (
    get_create_comment_usecase,
    get_delete_comment_usecase,
    get_like_comment_usecase,
    get_list_comments_usecase,
    get_unlike_comment_usecase,
    get_update_comment_usecase,
)
from src.poster.comments.schemas import (
    CommentLikesResponse,
    CommentPageResponse,
    CommentResponse,
    CreateCommentRequest,
    UpdateCommentRequest,
)
from src.poster.comments.usecases.create_comment import CreateCommentUseCase
from src.poster.comments.usecases.delete_comment import DeleteCommentUseCase
from src.poster.comments.usecases.like_comment import LikeCommentUseCase
from src.poster.comments.usecases.list_comments import ListCommentsUseCase
from src.poster.comments.usecases.unlike_comment import UnlikeCommentUseCase
from src.poster.comments.usecases.update_comment import UpdateCommentUseCase

router = APIRouter(prefix="/posts", tags=["Комментарии"])


@router.get("/{post_id}/comments", response_model=CommentPageResponse)
async def list_comments(
    post_id: int,
    user: Annotated[Account | None, Depends(get_current_user)],
    usecase: Annotated[ListCommentsUseCase, Depends(get_list_comments_usecase)],
    limit: Annotated[int, Query(ge=1, le=1000)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> CommentPageResponse:
    """Возвращает комментарии под постом, собранные в ветки."""
    return await usecase.execute(user=user, post_id=post_id, limit=limit, offset=offset)


@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED, response_model=CommentResponse)
async def create_comment(
    post_id: int,
    data: CreateCommentRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[CreateCommentUseCase, Depends(get_create_comment_usecase)],
) -> CommentResponse:
    """Пишет комментарий под постом или ответ на комментарий."""
    return await usecase.execute(user=user, post_id=post_id, data=data)


@router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    data: UpdateCommentRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UpdateCommentUseCase, Depends(get_update_comment_usecase)],
) -> CommentResponse:
    """Меняет текст моего комментария."""
    return await usecase.execute(user=user, comment_id=comment_id, data=data)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[DeleteCommentUseCase, Depends(get_delete_comment_usecase)],
) -> None:
    """Удаляет мой комментарий вместе с ответами в ветке."""
    await usecase.execute(user=user, comment_id=comment_id)


@router.post("/comments/{comment_id}/like", response_model=CommentLikesResponse)
async def like_comment(
    comment_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[LikeCommentUseCase, Depends(get_like_comment_usecase)],
) -> CommentLikesResponse:
    """Ставит лайк комментарию."""
    return await usecase.execute(user=user, comment_id=comment_id)


@router.delete("/comments/{comment_id}/like", response_model=CommentLikesResponse)
async def unlike_comment(
    comment_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UnlikeCommentUseCase, Depends(get_unlike_comment_usecase)],
) -> CommentLikesResponse:
    """Снимает лайк с комментария."""
    return await usecase.execute(user=user, comment_id=comment_id)
