from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.auth.internal.dependencies import require_internal_token
from src.poster.comments.dependencies import get_delete_comment_by_moderator_usecase
from src.poster.comments.usecases.delete_comment_by_moderator import DeleteCommentByModeratorUseCase

router = APIRouter(
    prefix="/internal/posts/comments",
    tags=["Модерация постов"],
    dependencies=[Depends(require_internal_token)],
)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    usecase: Annotated[DeleteCommentByModeratorUseCase, Depends(get_delete_comment_by_moderator_usecase)],
) -> None:
    """Удаляет комментарий, нарушающий правила."""
    await usecase.execute(comment_id=comment_id)
