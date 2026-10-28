from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from src.auth.internal.dependencies import require_internal_token
from src.poster.posts.schemas import PostResponse
from src.poster.reports.dependencies import (
    get_dismiss_report_usecase,
    get_list_reports_usecase,
    get_moderate_post_usecase,
)
from src.poster.reports.models import ReportStatus
from src.poster.reports.schemas import ModerationStatus, ReportPageResponse
from src.poster.reports.usecases.dismiss_report import DismissReportUseCase
from src.poster.reports.usecases.list_reports import ListReportsUseCase
from src.poster.reports.usecases.moderate_post import ModeratePostUseCase

router = APIRouter(
    prefix="/internal/posts",
    tags=["Модерация постов"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("/reports", response_model=ReportPageResponse)
async def list_reports(
    usecase: Annotated[ListReportsUseCase, Depends(get_list_reports_usecase)],
    report_status: Annotated[ReportStatus, Query(alias="status")] = ReportStatus.OPEN,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> ReportPageResponse:
    """Возвращает жалобы в одном статусе для модератора."""
    return await usecase.execute(status=report_status, limit=limit, offset=offset)


@router.post("/reports/{report_id}/dismiss", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_report(
    report_id: int,
    usecase: Annotated[DismissReportUseCase, Depends(get_dismiss_report_usecase)],
) -> None:
    """Отклоняет жалобу: нарушения нет."""
    await usecase.execute(report_id=report_id)


@router.put("/{post_id}/status", response_model=PostResponse)
async def moderate_post(
    post_id: int,
    moderation_status: Annotated[ModerationStatus, Query(alias="status")],
    usecase: Annotated[ModeratePostUseCase, Depends(get_moderate_post_usecase)],
) -> PostResponse:
    """Скрывает пост или возвращает его на сайт и закрывает жалобы на него."""
    return await usecase.execute(post_id=post_id, status=moderation_status)
