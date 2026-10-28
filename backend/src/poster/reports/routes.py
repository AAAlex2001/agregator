from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.reports.dependencies import get_report_comment_usecase, get_report_post_usecase
from src.poster.reports.schemas import ReportRequest
from src.poster.reports.usecases.report_comment import ReportCommentUseCase
from src.poster.reports.usecases.report_post import ReportPostUseCase

router = APIRouter(prefix="/posts", tags=["Жалобы"])


@router.post("/{post_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_post(
    post_id: int,
    data: ReportRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ReportPostUseCase, Depends(get_report_post_usecase)],
) -> None:
    """Отправляет жалобу на пост модератору."""
    await usecase.execute(user=user, post_id=post_id, data=data)


@router.post("/comments/{comment_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_comment(
    comment_id: int,
    data: ReportRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ReportCommentUseCase, Depends(get_report_comment_usecase)],
) -> None:
    """Отправляет жалобу на комментарий модератору."""
    await usecase.execute(user=user, comment_id=comment_id, data=data)
