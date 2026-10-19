"""Жалобы на посты и комментарии."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import require_user
from app.poster.comments.dependencies import get_comment
from app.poster.comments.models import PostComment
from app.poster.publications.dependencies import get_published_post
from app.poster.publications.models import Post
from app.poster.reports.dependencies import get_report_repository
from app.poster.reports.schemas import ReportSaveSchema
from app.poster.reports.services.repo import PostReportRepository
from models.account import Account

router = APIRouter()


@router.post("/{post_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_post(
    payload: ReportSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    reports: PostReportRepository = Depends(get_report_repository),
) -> None:
    """Пожаловаться на пост. Повторная жалоба до решения модератора ничего не меняет."""

    await reports.add_for_post(user.id, post.id, payload.reason)


@router.post("/comments/{comment_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_comment(
    payload: ReportSaveSchema,
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    reports: PostReportRepository = Depends(get_report_repository),
) -> None:
    """Пожаловаться на комментарий. Повторная жалоба до решения модератора ничего не меняет."""

    await reports.add_for_comment(user.id, comment.id, payload.reason)
