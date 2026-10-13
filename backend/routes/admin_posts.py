"""Модерация публикаций за внутренним токеном админки."""

from fastapi import APIRouter, Depends, HTTPException, Query

from dependencies.internal_auth import require_internal_token
from dependencies.posts import (
    get_comment_repository,
    get_dismiss_report_usecase,
    get_post,
    get_post_repository,
    get_report,
    get_report_repository,
    get_set_post_status_usecase,
)
from models.posts import Post, PostReport, PostStatus, ReportStatus
from schemas.posts import PostPageSchema, PostSchema, ReportPageSchema, ReportSchema, ViewerMarks
from services.posts.comment_repo import PostCommentRepository
from services.posts.repo import PostRepository
from services.posts.report_repo import PostReportRepository
from services.posts.use_cases.moderate_post import DismissReportUseCase, SetPostStatusUseCase

router = APIRouter(
    prefix="/internal/posts", tags=["admin-posts"], dependencies=[Depends(require_internal_token)]
)


@router.get("")
async def list_posts(
    status: PostStatus = PostStatus.PUBLISHED,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    posts: PostRepository = Depends(get_post_repository),
) -> PostPageSchema:
    """Возвращает публикации для проверки модератором."""
    items, total = await posts.list_by_status(status, limit, offset)
    return PostPageSchema.for_viewer(items, total, ViewerMarks())


@router.get("/reports")
async def list_reports(
    status: ReportStatus = ReportStatus.OPEN,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    reports: PostReportRepository = Depends(get_report_repository),
) -> ReportPageSchema:
    """Возвращает жалобы вместе с содержимым."""
    items, total = await reports.list_by_status(status, limit, offset)
    return ReportPageSchema(items=[ReportSchema.model_validate(item) for item in items], total=total)


@router.post("/reports/{report_id}/dismiss", status_code=204)
async def dismiss_report(
    report: PostReport = Depends(get_report),
    usecase: DismissReportUseCase = Depends(get_dismiss_report_usecase),
) -> None:
    """Закрывает жалобы на проверенный материал."""
    await usecase.execute(report)


@router.put("/{post_id}/status")
async def set_status(
    status: PostStatus,
    post: Post = Depends(get_post),
    usecase: SetPostStatusUseCase = Depends(get_set_post_status_usecase),
) -> PostSchema:
    """Скрывает публикацию или возвращает её в ленту."""
    return PostSchema.model_validate(await usecase.execute(post, status))


@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(
    comment_id: int,
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> None:
    """Удаляет комментарий с нарушением и ответы на него."""
    comment = await comments.get_by_id(comment_id)
    if comment is None:
        raise HTTPException(404, "Комментарий не найден")
    await comments.delete(comment)
