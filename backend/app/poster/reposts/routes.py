"""Репост публикации."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import require_user
from app.poster.publications.dependencies import get_published_post
from app.poster.publications.models import Post
from app.poster.publications.schemas import PostSchema
from app.poster.reposts.dependencies import get_create_repost_usecase
from app.poster.reposts.schemas import RepostSaveSchema
from app.poster.reposts.services.usecases.create_repost import CreateRepostUseCase
from models.account import Account

router = APIRouter()


@router.post("/{post_id}/repost", status_code=status.HTTP_201_CREATED)
async def repost(
    payload: RepostSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: CreateRepostUseCase = Depends(get_create_repost_usecase),
) -> PostSchema:
    """Репостнуть публикацию: просто или с комментарием."""

    created = await usecase.execute(user=user, post=post, html=payload.html)

    return PostSchema.model_validate(created)
