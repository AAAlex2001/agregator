"""Комиссия: репозиторий, письма, сценарии и заявка по id из пути."""

from fastapi import BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.commission.models import CommissionApplication
from app.commission.services.exceptions import ApplicationNotFoundError
from app.commission.services.letters import CommissionLetters
from app.commission.services.repo import CommissionRepository
from app.commission.services.usecases.review_application import ReviewApplicationUseCase
from app.commission.services.usecases.submit_application import SubmitApplicationUseCase
from app.core.database import get_db
from services.email.dispatcher import EmailDispatcher


def get_commission_repository(db: AsyncSession = Depends(get_db)) -> CommissionRepository:
    """Репозиторий заявок с сессией текущего запроса."""

    return CommissionRepository(db)


def get_commission_letters(background_tasks: BackgroundTasks) -> CommissionLetters:
    """Письма комиссии в фоне ответа."""

    return CommissionLetters(EmailDispatcher(background_tasks))


async def get_application(
    application_id: int,
    applications: CommissionRepository = Depends(get_commission_repository),
) -> CommissionApplication:
    """Заявка по id из пути."""

    application = await applications.get(application_id)
    if application is None:
        raise ApplicationNotFoundError

    return application


def get_submit_application_usecase(
    applications: CommissionRepository = Depends(get_commission_repository),
    letters: CommissionLetters = Depends(get_commission_letters),
) -> SubmitApplicationUseCase:
    """Подача заявки."""

    return SubmitApplicationUseCase(applications, letters)


def get_review_application_usecase(
    applications: CommissionRepository = Depends(get_commission_repository),
    letters: CommissionLetters = Depends(get_commission_letters),
) -> ReviewApplicationUseCase:
    """Решение комиссии."""

    return ReviewApplicationUseCase(applications, letters)
