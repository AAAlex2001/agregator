from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.support.files import TicketFiles
from src.support.repository import TicketRepository
from src.support.usecases.create_ticket import CreateTicketUseCase
from src.support.usecases.get_ticket import GetTicketUseCase
from src.support.usecases.list_tickets import ListTicketsUseCase
from src.support.usecases.reply_to_ticket import ReplyToTicketUseCase


def get_list_tickets_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListTicketsUseCase:
    """Собирает сценарий списка обращений."""
    return ListTicketsUseCase(TicketRepository(db))


def get_get_ticket_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> GetTicketUseCase:
    """Собирает сценарий просмотра обращения."""
    return GetTicketUseCase(TicketRepository(db))


def get_create_ticket_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CreateTicketUseCase:
    """Собирает сценарий создания обращения."""
    return CreateTicketUseCase(TicketRepository(db), TicketFiles())


def get_reply_to_ticket_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReplyToTicketUseCase:
    """Собирает сценарий ответа в обращение."""
    return ReplyToTicketUseCase(TicketRepository(db), TicketFiles())
