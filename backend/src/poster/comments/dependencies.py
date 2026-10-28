from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.notifications.repository import NotificationRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.comments.repository import CommentRepository
from src.poster.comments.usecases.create_comment import CreateCommentUseCase
from src.poster.comments.usecases.delete_comment import DeleteCommentUseCase
from src.poster.comments.usecases.delete_comment_by_moderator import DeleteCommentByModeratorUseCase
from src.poster.comments.usecases.like_comment import LikeCommentUseCase
from src.poster.comments.usecases.list_comments import ListCommentsUseCase
from src.poster.comments.usecases.unlike_comment import UnlikeCommentUseCase
from src.poster.comments.usecases.update_comment import UpdateCommentUseCase
from src.poster.posts.repository import PostRepository


def get_list_comments_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListCommentsUseCase:
    """Собирает сценарий списка комментариев."""
    return ListCommentsUseCase(CommentRepository(db), PostRepository(db), AccountRepository(db))


def get_create_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CreateCommentUseCase:
    """Собирает сценарий нового комментария."""
    notify = NotifyPostActivityUseCase(NotificationRepository(db), AccountRepository(db))

    return CreateCommentUseCase(CommentRepository(db), PostRepository(db), AccountRepository(db), notify)


def get_update_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UpdateCommentUseCase:
    """Собирает сценарий правки комментария."""
    return UpdateCommentUseCase(CommentRepository(db), AccountRepository(db))


def get_delete_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DeleteCommentUseCase:
    """Собирает сценарий удаления комментария."""
    return DeleteCommentUseCase(CommentRepository(db), PostRepository(db))


def get_like_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> LikeCommentUseCase:
    """Собирает сценарий лайка комментария."""
    return LikeCommentUseCase(CommentRepository(db), PostRepository(db))


def get_unlike_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UnlikeCommentUseCase:
    """Собирает сценарий снятия лайка с комментария."""
    return UnlikeCommentUseCase(CommentRepository(db))


def get_delete_comment_by_moderator_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DeleteCommentByModeratorUseCase:
    """Собирает сценарий удаления комментария модератором."""
    return DeleteCommentByModeratorUseCase(CommentRepository(db), PostRepository(db))
