"""Модерация: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.moderation.services.repo import ModerationRepository
from app.poster.moderation.services.usecases.dismiss_report import DismissReportUseCase
from app.poster.moderation.services.usecases.set_post_status import SetPostStatusUseCase
from app.poster.publications.dependencies import get_post_repository
from app.poster.publications.services.repo import PostRepository
from app.poster.reports.dependencies import get_report_repository
from app.poster.reports.services.repo import PostReportRepository


def get_moderation_repository(db: AsyncSession = Depends(get_db)) -> ModerationRepository:
    """Посты для модератора."""

    return ModerationRepository(db)


def get_set_post_status_usecase(
    posts: PostRepository = Depends(get_post_repository),
    reports: PostReportRepository = Depends(get_report_repository),
) -> SetPostStatusUseCase:
    """Сценарий скрытия поста и возврата в ленту."""

    return SetPostStatusUseCase(posts, reports)


def get_dismiss_report_usecase(
    reports: PostReportRepository = Depends(get_report_repository),
) -> DismissReportUseCase:
    """Сценарий отклонения жалобы."""

    return DismissReportUseCase(reports)
