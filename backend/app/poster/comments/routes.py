"""Комментарии к публикациям: ветки, новые, правка, удаление и лайки."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import get_current_user, require_user
from app.core.pagination import PageQuery
from app.poster.comments.dependencies import (
    get_comment,
    get_comment_repository,
    get_create_comment_usecase,
    get_edit_comment_usecase,
    get_like_comment_usecase,
    get_load_threads_usecase,
    get_own_comment,
)
from app.poster.comments.models import PostComment
from app.poster.comments.schemas import (
    CommentEditSchema,
    CommentSaveSchema,
    CommentSchema,
    CommentThreadPageSchema,
)
from app.poster.comments.services.repo import PostCommentRepository
from app.poster.comments.services.usecases.create_comment import CreateCommentUseCase
from app.poster.comments.services.usecases.edit_comment import EditCommentUseCase
from app.poster.comments.services.usecases.like_comment import LikeCommentUseCase
from app.poster.comments.services.usecases.load_threads import LoadThreadsUseCase
from app.poster.publications.dependencies import get_published_post, get_visible_post
from app.poster.publications.models import Post
from app.poster.reactions.schemas import LikesSchema
from models.account import Account

router = APIRouter()


@router.get("/{post_id}/comments")
async def list_comments(
    page: PageQuery = Depends(),
    post: Post = Depends(get_visible_post),
    user: Account | None = Depends(get_current_user),
    usecase: LoadThreadsUseCase = Depends(get_load_threads_usecase),
) -> CommentThreadPageSchema:
    """Ветки комментариев по порядку написания. Открыты всем."""

    return await usecase.execute(post=post, user=user, limit=page.limit, offset=page.offset)


@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED)
async def create_comment(
    payload: CommentSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: CreateCommentUseCase = Depends(get_create_comment_usecase),
) -> CommentSchema:
    """Написать комментарий или ответить на комментарий."""

    comment = await usecase.execute(
        user=user,
        post=post,
        text=payload.text,
        reply_to_id=payload.reply_to_id,
    )

    return CommentSchema.model_validate(comment)


@router.put("/comments/{comment_id}")
async def update_comment(
    payload: CommentEditSchema,
    comment: PostComment = Depends(get_own_comment),
    user: Account = Depends(require_user),
    usecase: EditCommentUseCase = Depends(get_edit_comment_usecase),
) -> CommentSchema:
    """Изменить текст своего комментария."""

    return await usecase.execute(user=user, comment=comment, text=payload.text)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment: PostComment = Depends(get_own_comment),
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> None:
    """Удалить свой комментарий вместе с ответами."""

    await comments.delete(comment)


@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    usecase: LikeCommentUseCase = Depends(get_like_comment_usecase),
) -> LikesSchema:
    """Поставить лайк комментарию."""

    return await usecase.execute(user=user, comment=comment, liked=True)


@router.delete("/comments/{comment_id}/like")
async def unlike_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    usecase: LikeCommentUseCase = Depends(get_like_comment_usecase),
) -> LikesSchema:
    """Убрать лайк с комментария."""

    return await usecase.execute(user=user, comment=comment, liked=False)
