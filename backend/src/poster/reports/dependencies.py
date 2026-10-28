from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.poster.comments.repository import CommentRepository
from src.poster.posts.repository import PostRepository
from src.poster.reports.repository import ReportRepository
from src.poster.reports.usecases.dismiss_report import DismissReportUseCase
from src.poster.reports.usecases.list_reports import ListReportsUseCase
from src.poster.reports.usecases.moderate_post import ModeratePostUseCase
from src.poster.reports.usecases.report_comment import ReportCommentUseCase
from src.poster.reports.usecases.report_post import ReportPostUseCase


def get_report_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReportPostUseCase:
    """Собирает сценарий жалобы на пост."""
    return ReportPostUseCase(ReportRepository(db), PostRepository(db))


def get_report_comment_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReportCommentUseCase:
    """Собирает сценарий жалобы на комментарий."""
    return ReportCommentUseCase(ReportRepository(db), CommentRepository(db))


def get_list_reports_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListReportsUseCase:
    """Собирает сценарий списка жалоб."""
    return ListReportsUseCase(ReportRepository(db), AccountRepository(db))


def get_dismiss_report_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DismissReportUseCase:
    """Собирает сценарий отклонения жалобы."""
    return DismissReportUseCase(ReportRepository(db))


def get_moderate_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ModeratePostUseCase:
    """Собирает сценарий модерации поста."""
    return ModeratePostUseCase(PostRepository(db), ReportRepository(db), AccountRepository(db))
