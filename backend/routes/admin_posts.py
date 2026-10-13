"""Модерация публикаций за внутренним токеном админки."""

from fastapi import APIRouter, Depends, Query, status

from dependencies.internal_auth import require_internal_token
from dependencies.posts import (
    get_any_comment,
    get_comment_repository,
    get_delete_post_usecase,
    get_dismiss_report_usecase,
    get_post,
    get_post_repository,
    get_report,
    get_report_repository,
    get_set_post_status_usecase,
)
from models.posts import Post, PostComment, PostReport, PostStatus, ReportStatus
from schemas.posts import (
    ModerationStatus,
    PostPageSchema,
    PostSchema,
    ReportPageSchema,
    ReportSchema,
)
from services.posts.comment_repo import PostCommentRepository
from services.posts.repo import PostRepository
from services.posts.report_repo import PostReportRepository
from services.posts.use_cases.delete_post import DeletePostUseCase
from services.posts.use_cases.moderate_post import DismissReportUseCase, SetPostStatusUseCase

router = APIRouter(
    prefix="/internal/posts",
    tags=["admin-posts"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("")
async def list_posts(
    post_status: PostStatus = Query(PostStatus.PUBLISHED, alias="status"),
    author_id: int | None = Query(None, ge=1),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    posts: PostRepository = Depends(get_post_repository),
) -> PostPageSchema:
    """Публикации одного состояния, при необходимости — одного автора."""

    items, total = await posts.list_for_moderation(post_status, author_id, limit, offset)
    schemas = [PostSchema.model_validate(item) for item in items]
    return PostPageSchema(items=schemas, total=total)


@router.get("/reports")
async def list_reports(
    report_status: ReportStatus = Query(ReportStatus.OPEN, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    reports: PostReportRepository = Depends(get_report_repository),
) -> ReportPageSchema:
    """Жалобы одного состояния вместе с материалом."""

    items, total = await reports.list_by_status(report_status, limit, offset)
    schemas = [ReportSchema.model_validate(item) for item in items]
    return ReportPageSchema(items=schemas, total=total)


@router.post("/reports/{report_id}/dismiss", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_report(
    report: PostReport = Depends(get_report),
    usecase: DismissReportUseCase = Depends(get_dismiss_report_usecase),
) -> None:
    """Отклонить жалобу: материал в порядке."""

    await usecase.execute(report)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment: PostComment = Depends(get_any_comment),
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> None:
    """Удалить комментарий с нарушением вместе с ответами."""

    await comments.delete(comment)


@router.get("/{post_id}")
async def get_post_detail(post: Post = Depends(get_post)) -> PostSchema:
    """Публикация любого статуса."""

    return PostSchema.model_validate(post)


@router.put("/{post_id}/status")
async def set_status(
    moderation_status: ModerationStatus = Query(alias="status"),
    post: Post = Depends(get_post),
    usecase: SetPostStatusUseCase = Depends(get_set_post_status_usecase),
) -> PostSchema:
    """Скрыть публикацию или вернуть её в ленту."""

    updated = await usecase.execute(post, moderation_status)
    return PostSchema.model_validate(updated)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post: Post = Depends(get_post),
    usecase: DeletePostUseCase = Depends(get_delete_post_usecase),
) -> None:
    """Удалить пост любого автора вместе с файлами, репостами и обсуждением."""

    await usecase.execute(post)
