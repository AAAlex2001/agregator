"""Поддержка: репозиторий, фабрики сценариев и своё обращение по id из пути."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import require_user
from app.core.database import get_db
from app.support.models import SupportTicket
from app.support.services.exceptions import TicketNotFoundError
from app.support.services.repo import SupportRepository
from app.support.services.storage import SupportFileStorage
from app.support.services.usecases.create_ticket import CreateTicketUseCase
from app.support.services.usecases.reply_to_ticket import ReplyToTicketUseCase
from app.support.services.usecases.view_ticket import ViewTicketUseCase
from models.account import Account


def get_support_repository(db: AsyncSession = Depends(get_db)) -> SupportRepository:
    """Репозиторий обращений с сессией текущего запроса."""

    return SupportRepository(db)


def get_create_ticket_usecase(
    tickets: SupportRepository = Depends(get_support_repository),
) -> CreateTicketUseCase:
    """Сценарий нового обращения."""

    return CreateTicketUseCase(tickets, SupportFileStorage())


def get_view_ticket_usecase(
    tickets: SupportRepository = Depends(get_support_repository),
) -> ViewTicketUseCase:
    """Сценарий просмотра обращения."""

    return ViewTicketUseCase(tickets)


def get_reply_to_ticket_usecase(
    tickets: SupportRepository = Depends(get_support_repository),
) -> ReplyToTicketUseCase:
    """Сценарий ответа в обращение."""

    return ReplyToTicketUseCase(tickets, SupportFileStorage())


async def get_own_ticket(
    ticket_id: int,
    user: Account = Depends(require_user),
    tickets: SupportRepository = Depends(get_support_repository),
) -> SupportTicket:
    """Своё обращение по id из пути. Чужое выглядит как несуществующее — 404."""

    ticket = await tickets.get_for_user(ticket_id, user.id)
    if ticket is None:
        raise TicketNotFoundError

    return ticket
