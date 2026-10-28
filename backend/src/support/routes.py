from typing import Annotated

from fastapi import APIRouter, Depends, Form, Query

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.support.dependencies import (
    get_create_ticket_usecase,
    get_get_ticket_usecase,
    get_list_tickets_usecase,
    get_reply_to_ticket_usecase,
)
from src.support.schemas import (
    CreateTicketRequest,
    ReplyToTicketRequest,
    TicketDetailResponse,
    TicketListResponse,
)
from src.support.usecases.create_ticket import CreateTicketUseCase
from src.support.usecases.get_ticket import GetTicketUseCase
from src.support.usecases.list_tickets import ListTicketsUseCase
from src.support.usecases.reply_to_ticket import ReplyToTicketUseCase

router = APIRouter(prefix="/support/tickets", tags=["Поддержка"])


@router.get("", response_model=TicketListResponse)
async def list_tickets(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListTicketsUseCase, Depends(get_list_tickets_usecase)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
) -> TicketListResponse:
    """Возвращает мои обращения: недавно изменённые первыми."""
    return await usecase.execute(user=user, skip=skip, limit=limit)


@router.post("", response_model=TicketDetailResponse)
async def create_ticket(
    data: Annotated[CreateTicketRequest, Form()],
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[CreateTicketUseCase, Depends(get_create_ticket_usecase)],
) -> TicketDetailResponse:
    """Создаёт обращение с темой, категорией, первым сообщением и файлами."""
    return await usecase.execute(user=user, data=data)


@router.get("/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket(
    ticket_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[GetTicketUseCase, Depends(get_get_ticket_usecase)],
) -> TicketDetailResponse:
    """Возвращает моё обращение со всей перепиской."""
    return await usecase.execute(user=user, ticket_id=ticket_id)


@router.post("/{ticket_id}/messages", response_model=TicketDetailResponse)
async def reply_to_ticket(
    ticket_id: int,
    data: Annotated[ReplyToTicketRequest, Form()],
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ReplyToTicketUseCase, Depends(get_reply_to_ticket_usecase)],
) -> TicketDetailResponse:
    """Добавляет мой ответ в обращение: текст, файлы или и то и другое."""
    return await usecase.execute(user=user, ticket_id=ticket_id, data=data)
