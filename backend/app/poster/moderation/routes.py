"""Модерация публикаций за внутренним токеном админки."""

from fastapi import APIRouter, Depends, Query, status

from app.auth.internal.dependencies import require_internal_token
from app.poster.comments.dependencies import get_any_comment, get_comment_repository
from app.poster.comments.models import PostComment
from app.poster.comments.services.repo import PostCommentRepository
from app.poster.moderation.dependencies import (
    get_dismiss_report_usecase,
    get_moderation_repository,
    get_set_post_status_usecase,
)
from app.poster.moderation.schemas import ModerationStatus
from app.poster.moderation.services.repo import ModerationRepository
from app.poster.moderation.services.usecases.dismiss_report import DismissReportUseCase
from app.poster.moderation.services.usecases.set_post_status import SetPostStatusUseCase
from app.poster.publications.dependencies import get_delete_post_usecase, get_post
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.schemas import PostPageSchema, PostSchema
from app.poster.publications.services.usecases.delete_post import DeletePostUseCase
from app.poster.reports.dependencies import get_report, get_report_repository
from app.poster.reports.models import PostReport, ReportStatus
from app.poster.reports.schemas import ReportPageSchema, ReportSchema
from app.poster.reports.services.repo import PostReportRepository

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
    moderation: ModerationRepository = Depends(get_moderation_repository),
) -> PostPageSchema:
    """Публикации одного состояния, при необходимости — одного автора."""

    items, total = await moderation.list_posts(post_status, author_id, limit, offset)

    return PostPageSchema(items=[PostSchema.model_validate(item) for item in items], total=total)


@router.get("/reports")
async def list_reports(
    report_status: ReportStatus = Query(ReportStatus.OPEN, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    reports: PostReportRepository = Depends(get_report_repository),
) -> ReportPageSchema:
    """Жалобы одного состояния вместе с материалом."""

    items, total = await reports.list_by_status(report_status, limit, offset)

    return ReportPageSchema(items=[ReportSchema.model_validate(item) for item in items], total=total)


@router.post("/reports/{report_id}/dismiss", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_report(
    report: PostReport = Depends(get_report),
    usecase: DismissReportUseCase = Depends(get_dismiss_report_usecase),
) -> None:
    """Отклонить жалобу: материал в порядке."""

    await usecase.execute(report=report)


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

    updated = await usecase.execute(post=post, status=moderation_status)

    return PostSchema.model_validate(updated)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post: Post = Depends(get_post),
    usecase: DeletePostUseCase = Depends(get_delete_post_usecase),
) -> None:
    """Удалить пост любого автора с сайта вместе с файлами, репостами и обсуждением."""

    await usecase.execute(post=post, from_channels=False)
