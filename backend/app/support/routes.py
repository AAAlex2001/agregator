"""Обращения пользователя в поддержку."""

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile

from app.auth.sessions.dependencies import require_user
from app.support.dependencies import (
    get_create_ticket_usecase,
    get_own_ticket,
    get_reply_to_ticket_usecase,
    get_support_repository,
    get_view_ticket_usecase,
)
from app.support.models import SupportTicket, TicketCategory
from app.support.schemas import SupportTicketDetailSchema, SupportTicketListSchema
from app.support.services.repo import SupportRepository
from app.support.services.usecases.create_ticket import CreateTicketUseCase
from app.support.services.usecases.reply_to_ticket import ReplyToTicketUseCase
from app.support.services.usecases.view_ticket import ViewTicketUseCase
from models.account import Account

router = APIRouter(prefix="/support/tickets", tags=["support"])


@router.get("", response_model=SupportTicketListSchema)
async def list_my_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user: Account = Depends(require_user),
    tickets: SupportRepository = Depends(get_support_repository),
) -> SupportTicketListSchema:
    """Мои обращения, недавно изменённые первыми."""

    page = await tickets.list_for_user(user.id, skip=skip, limit=limit + 1)

    return SupportTicketListSchema.from_tickets(page, limit)


@router.post("", response_model=SupportTicketDetailSchema)
async def create_ticket(
    subject: str = Form(..., min_length=1, max_length=200),
    category: TicketCategory = Form(...),
    message: str = Form(..., min_length=1, max_length=5000),
    files: list[UploadFile] = File(default=[]),
    user: Account = Depends(require_user),
    usecase: CreateTicketUseCase = Depends(get_create_ticket_usecase),
) -> SupportTicketDetailSchema:
    """Новое обращение с темой, категорией, первым сообщением и файлами."""

    ticket = await usecase.execute(
        user=user,
        subject=subject,
        category=category,
        text=message,
        files=files,
    )

    return SupportTicketDetailSchema.from_ticket(ticket)


@router.get("/{ticket_id}", response_model=SupportTicketDetailSchema)
async def get_ticket(
    ticket: SupportTicket = Depends(get_own_ticket),
    usecase: ViewTicketUseCase = Depends(get_view_ticket_usecase),
) -> SupportTicketDetailSchema:
    """Обращение со всей перепиской."""

    return SupportTicketDetailSchema.from_ticket(await usecase.execute(ticket))


@router.post("/{ticket_id}/messages", response_model=SupportTicketDetailSchema)
async def reply_to_ticket(
    text: str = Form(default="", max_length=5000),
    files: list[UploadFile] = File(default=[]),
    ticket: SupportTicket = Depends(get_own_ticket),
    user: Account = Depends(require_user),
    usecase: ReplyToTicketUseCase = Depends(get_reply_to_ticket_usecase),
) -> SupportTicketDetailSchema:
    """Ответ в своё обращение текстом и/или файлами."""

    ticket = await usecase.execute(ticket=ticket, user=user, text=text, files=files)

    return SupportTicketDetailSchema.from_ticket(ticket)
