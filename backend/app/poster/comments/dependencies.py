"""Комментарии: репозитории, фабрики сценариев и комментарий по id из пути."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import get_current_user, require_user
from app.core.database import get_db
from app.poster.comments.models import PostComment
from app.poster.comments.services.exceptions import CommentNotFoundError
from app.poster.comments.services.repo import CommentLikeRepository, PostCommentRepository
from app.poster.comments.services.usecases.create_comment import CreateCommentUseCase
from app.poster.comments.services.usecases.edit_comment import EditCommentUseCase
from app.poster.comments.services.usecases.like_comment import LikeCommentUseCase
from app.poster.comments.services.usecases.load_threads import LoadThreadsUseCase
from app.poster.notifications import ActivityNotifier, get_activity_notifier
from app.poster.publications.dependencies import ensure_visible, get_post_repository
from app.poster.publications.services.repo import PostRepository
from models.account import Account


def get_comment_repository(db: AsyncSession = Depends(get_db)) -> PostCommentRepository:
    """Комментарии."""

    return PostCommentRepository(db)


def get_comment_like_repository(db: AsyncSession = Depends(get_db)) -> CommentLikeRepository:
    """Лайки комментариев."""

    return CommentLikeRepository(db)


def get_load_threads_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> LoadThreadsUseCase:
    """Сценарий веток комментариев."""

    return LoadThreadsUseCase(comments, likes)


def get_create_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    notify: ActivityNotifier = Depends(get_activity_notifier),
) -> CreateCommentUseCase:
    """Сценарий нового комментария."""

    return CreateCommentUseCase(comments, notify)


def get_edit_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> EditCommentUseCase:
    """Сценарий правки комментария."""

    return EditCommentUseCase(comments, likes)


def get_like_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> LikeCommentUseCase:
    """Сценарий лайка комментария."""

    return LikeCommentUseCase(comments, likes)


async def get_any_comment(
    comment_id: int,
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> PostComment:
    """Комментарий без проверки поста — для модератора."""

    comment = await comments.get_by_id(comment_id)
    if comment is None:
        raise CommentNotFoundError

    return comment


async def get_comment(
    comment: PostComment = Depends(get_any_comment),
    posts: PostRepository = Depends(get_post_repository),
    user: Account | None = Depends(get_current_user),
) -> PostComment:
    """Комментарий к посту, который можно показать тому, кто смотрит."""

    post = await posts.get_by_id(comment.post_id)
    if post is None:
        raise CommentNotFoundError

    ensure_visible(post, user)

    return comment


async def get_own_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
) -> PostComment:
    """Свой комментарий."""

    if comment.author_id != user.id:
        raise CommentNotFoundError

    return comment
