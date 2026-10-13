"""Публикации: репозитории, фабрики сценариев и загрузка поста, комментария, жалобы и автора по id из пути.

Загрузчики заодно проверяют доступ: чужое и неопубликованное выглядит как несуществующее (404).
"""

from dataclasses import dataclass

from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.posts_auth import get_current_user, require_user
from dependencies.visitor import get_visitor_key, interaction_key
from models.account import Account
from models.posts import Post, PostComment, PostReport, PostStatus
from services.notifications.repository import NotificationRepository
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)
from services.posts.ai import AiClient
from services.posts.ai_repo import AiRequestRepository
from services.posts.comment_repo import CommentLikeRepository, PostCommentRepository
from services.posts.config import get_settings
from services.posts.exceptions import (
    AuthorNotFoundError,
    CommentNotFoundError,
    PostNotFoundError,
    ReportNotFoundError,
)
from services.posts.follow_repository import FollowRepository
from services.posts.repo import (
    PostLikeRepository,
    PostMediaRepository,
    PostRepository,
    PostSaveRepository,
    PostViewRepository,
)
from services.posts.report_repo import PostReportRepository
from services.posts.use_cases.count_view import CountPostViewUseCase
from services.posts.use_cases.create_comment import CreateCommentUseCase
from services.posts.use_cases.create_post import CreatePostUseCase
from services.posts.use_cases.create_repost import CreateRepostUseCase
from services.posts.use_cases.delete_post import DeletePostUseCase
from services.posts.use_cases.follow_author import FollowAuthorUseCase
from services.posts.use_cases.like_post import LikePostUseCase
from services.posts.use_cases.load_marks import LoadMarksUseCase
from services.posts.use_cases.load_threads import LoadThreadsUseCase
from services.posts.use_cases.manage_comment import EditCommentUseCase, LikeCommentUseCase
from services.posts.use_cases.manage_media import DeletePostMediaUseCase, UploadPostMediaUseCase
from services.posts.use_cases.moderate_post import DismissReportUseCase, SetPostStatusUseCase
from services.posts.use_cases.update_post import UpdatePostUseCase
from services.posts.use_cases.write_with_ai import WritePostWithAiUseCase


@dataclass
class PageQuery:
    """Страница списка из параметров запроса."""

    limit: int = Query(20, ge=1, le=50)
    offset: int = Query(0, ge=0)


def get_post_repository(db: AsyncSession = Depends(get_db)) -> PostRepository:
    """Посты."""
    return PostRepository(db)


def get_post_media_repository(db: AsyncSession = Depends(get_db)) -> PostMediaRepository:
    """Файлы к постам."""
    return PostMediaRepository(db)


def get_post_like_repository(db: AsyncSession = Depends(get_db)) -> PostLikeRepository:
    """Лайки постов."""
    return PostLikeRepository(db)


def get_post_save_repository(db: AsyncSession = Depends(get_db)) -> PostSaveRepository:
    """Сохранённые посты."""
    return PostSaveRepository(db)


def get_post_view_repository(db: AsyncSession = Depends(get_db)) -> PostViewRepository:
    """Просмотры постов."""
    return PostViewRepository(db)


def get_comment_repository(db: AsyncSession = Depends(get_db)) -> PostCommentRepository:
    """Комментарии."""
    return PostCommentRepository(db)


def get_comment_like_repository(db: AsyncSession = Depends(get_db)) -> CommentLikeRepository:
    """Лайки комментариев."""
    return CommentLikeRepository(db)


def get_follow_repository(db: AsyncSession = Depends(get_db)) -> FollowRepository:
    """Подписки на авторов."""
    return FollowRepository(db)


def get_report_repository(db: AsyncSession = Depends(get_db)) -> PostReportRepository:
    """Жалобы."""
    return PostReportRepository(db)


def get_notify_usecase(db: AsyncSession = Depends(get_db)) -> CreatePostActivityNotificationUseCase:
    """Уведомления о реакциях на публикации."""
    return CreatePostActivityNotificationUseCase(NotificationRepository(db))


def get_load_marks_usecase(
    likes: PostLikeRepository = Depends(get_post_like_repository),
    saves: PostSaveRepository = Depends(get_post_save_repository),
    follows: FollowRepository = Depends(get_follow_repository),
) -> LoadMarksUseCase:
    """Отметки того, кто смотрит посты."""
    return LoadMarksUseCase(likes, saves, follows)


def get_load_threads_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> LoadThreadsUseCase:
    """Ветки комментариев."""
    return LoadThreadsUseCase(comments, likes)


def get_create_post_usecase(
    posts: PostRepository = Depends(get_post_repository),
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> CreatePostUseCase:
    """Новый пост."""
    return CreatePostUseCase(posts, media)


def get_update_post_usecase(
    posts: PostRepository = Depends(get_post_repository),
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> UpdatePostUseCase:
    """Правка поста."""
    return UpdatePostUseCase(posts, media)


def get_delete_post_usecase(posts: PostRepository = Depends(get_post_repository)) -> DeletePostUseCase:
    """Удаление поста."""
    return DeletePostUseCase(posts)


def get_create_repost_usecase(
    posts: PostRepository = Depends(get_post_repository),
    notify: CreatePostActivityNotificationUseCase = Depends(get_notify_usecase),
) -> CreateRepostUseCase:
    """Репост."""
    return CreateRepostUseCase(posts, notify)


def get_like_post_usecase(
    posts: PostRepository = Depends(get_post_repository),
    likes: PostLikeRepository = Depends(get_post_like_repository),
    notify: CreatePostActivityNotificationUseCase = Depends(get_notify_usecase),
) -> LikePostUseCase:
    """Лайк поста."""
    return LikePostUseCase(posts, likes, notify)


def get_count_post_view_usecase(
    posts: PostRepository = Depends(get_post_repository),
    views: PostViewRepository = Depends(get_post_view_repository),
) -> CountPostViewUseCase:
    """Просмотр поста."""
    return CountPostViewUseCase(posts, views)


def get_create_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    notify: CreatePostActivityNotificationUseCase = Depends(get_notify_usecase),
) -> CreateCommentUseCase:
    """Новый комментарий."""
    return CreateCommentUseCase(comments, notify)


def get_edit_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> EditCommentUseCase:
    """Правка комментария."""
    return EditCommentUseCase(comments, likes)


def get_like_comment_usecase(
    comments: PostCommentRepository = Depends(get_comment_repository),
    likes: CommentLikeRepository = Depends(get_comment_like_repository),
) -> LikeCommentUseCase:
    """Лайк комментария."""
    return LikeCommentUseCase(comments, likes)


def get_follow_author_usecase(
    follows: FollowRepository = Depends(get_follow_repository),
    notify: CreatePostActivityNotificationUseCase = Depends(get_notify_usecase),
) -> FollowAuthorUseCase:
    """Подписка на автора."""
    return FollowAuthorUseCase(follows, notify)


def get_upload_post_media_usecase(
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> UploadPostMediaUseCase:
    """Загрузка фото или видео."""
    return UploadPostMediaUseCase(media)


def get_delete_post_media_usecase(
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> DeletePostMediaUseCase:
    """Удаление непривязанного файла."""
    return DeletePostMediaUseCase(media)


def get_write_with_ai_usecase(db: AsyncSession = Depends(get_db)) -> WritePostWithAiUseCase:
    """ИИ-помощник."""
    settings = get_settings()
    return WritePostWithAiUseCase(AiClient(settings), AiRequestRepository(db), settings)


def get_set_post_status_usecase(
    posts: PostRepository = Depends(get_post_repository),
    reports: PostReportRepository = Depends(get_report_repository),
) -> SetPostStatusUseCase:
    """Скрытие поста и возврат в ленту."""
    return SetPostStatusUseCase(posts, reports)


def get_dismiss_report_usecase(
    reports: PostReportRepository = Depends(get_report_repository),
) -> DismissReportUseCase:
    """Отклонение жалобы."""
    return DismissReportUseCase(reports)


async def get_post(post_id: int, posts: PostRepository = Depends(get_post_repository)) -> Post:
    """Пост любого статуса — для модератора."""

    post = await posts.get_by_id(post_id)
    if post is None:
        raise PostNotFoundError()
    return post


async def get_visible_post(
    post: Post = Depends(get_post),
    user: Account | None = Depends(get_current_user),
) -> Post:
    """Пост, который можно показать: опубликованный или свой."""

    hidden_original = post.repost_of is not None and post.repost_of.status != PostStatus.PUBLISHED
    own = user is not None and post.author_id == user.id
    if hidden_original or not (post.status == PostStatus.PUBLISHED or own):
        raise PostNotFoundError()
    return post


async def get_published_post(post: Post = Depends(get_visible_post)) -> Post:
    """Опубликованный пост: на него можно реагировать."""

    if post.status != PostStatus.PUBLISHED:
        raise PostNotFoundError()
    return post


async def get_own_post(post: Post = Depends(get_post), user: Account = Depends(require_user)) -> Post:
    """Свой пост."""

    if post.author_id != user.id:
        raise PostNotFoundError()
    return post


async def get_any_comment(
    comment_id: int,
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> PostComment:
    """Комментарий без проверки поста — для модератора."""

    comment = await comments.get_by_id(comment_id)
    if comment is None:
        raise CommentNotFoundError()
    return comment


async def get_comment(
    comment: PostComment = Depends(get_any_comment),
    posts: PostRepository = Depends(get_post_repository),
    user: Account | None = Depends(get_current_user),
) -> PostComment:
    """Комментарий к посту, который можно показать."""

    post = await posts.get_by_id(comment.post_id)
    if post is None:
        raise CommentNotFoundError()
    await get_visible_post(post, user)
    return comment


async def get_own_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
) -> PostComment:
    """Свой комментарий."""

    if comment.author_id != user.id:
        raise CommentNotFoundError()
    return comment


async def get_report(
    report_id: int, reports: PostReportRepository = Depends(get_report_repository)
) -> PostReport:
    """Жалоба для модератора."""

    report = await reports.get_by_id(report_id)
    if report is None:
        raise ReportNotFoundError()
    return report


def get_post_visitor(
    user: Account | None = Depends(get_current_user),
    visitor_key: str = Depends(get_visitor_key),
) -> str:
    """Кто смотрит пост: вошедший — по аккаунту, гость — по cookie посетителя."""

    return interaction_key(user.id if user else None, visitor_key)


async def get_author(author_id: int, db: AsyncSession = Depends(get_db)) -> Account:
    """Действующий автор."""

    author = await db.get(Account, author_id)
    if author is None or not author.is_active:
        raise AuthorNotFoundError()
    return author
