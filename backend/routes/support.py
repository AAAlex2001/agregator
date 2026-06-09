from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketCategory,
    TicketMessageAuthor,
)
from models.user import User
from schemas.support import (
    SupportTicketDetail,
    SupportTicketList,
    SupportTicketMessageItem,
    SupportTicketSummary,
)
from services.support import (
    CreateTicketUseCase,
    GetTicketForUserUseCase,
    ListUserTicketsUseCase,
    ReplyToTicketUseCase,
    SupportFileStorage,
    SupportRepository,
)

router = APIRouter(tags=["support"])


def author_kind_to_public(kind: TicketMessageAuthor) -> str:
    return "user" if kind == TicketMessageAuthor.USER else "support"


def message_to_item(message: SupportTicketMessage) -> SupportTicketMessageItem:
    attachments = message.attachments if isinstance(message.attachments, list) else []
    return SupportTicketMessageItem(
        id=message.id,
        author=author_kind_to_public(message.author_kind),
        author_name=message.author_name or "",
        text=message.text or "",
        created_at=message.created_at,
        attachments=attachments,
    )


def ticket_to_summary(ticket: SupportTicket) -> SupportTicketSummary:
    preview = (ticket.last_message_text or "")[:160]
    return SupportTicketSummary(
        id=ticket.id,
        number=ticket.number,
        subject=ticket.subject,
        category=TicketCategory(ticket.category),
        status=ticket.status,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        has_unread=bool(ticket.has_unread_for_user),
        last_message_preview=preview,
    )


def ticket_to_detail(ticket: SupportTicket) -> SupportTicketDetail:
    summary = ticket_to_summary(ticket)
    return SupportTicketDetail(
        **summary.model_dump(),
        messages=[message_to_item(m) for m in ticket.messages],
    )


async def get_user_or_404(db: AsyncSession, user_id: int) -> User:
    user = (await db.execute(select(User).where(User.id == user_id))).scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return user


@router.get("/support/tickets", response_model=SupportTicketList)
async def list_my_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SupportTicketList:
    "Возвращает тикеты текущего пользователя с пагинацией."
    use_case = ListUserTicketsUseCase(SupportRepository(db))
    items, has_more = await use_case.execute(user_id, skip, limit)
    return SupportTicketList(
        items=[ticket_to_summary(t) for t in items],
        has_more=has_more,
    )


@router.post(
    "/support/tickets",
    response_model=SupportTicketDetail,
    dependencies=[Depends(rate_limit("support_ticket_create", max_calls=3, window_seconds=3600))],
)
async def create_my_ticket(
    subject: str = Form(..., min_length=1, max_length=200),
    category: TicketCategory = Form(...),
    message: str = Form(..., min_length=1, max_length=5000),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SupportTicketDetail:
    "Создаёт новый тикет поддержки с темой, категорией и первым сообщением/вложениями."
    user = await get_user_or_404(db, user_id)
    repo = SupportRepository(db)
    storage = SupportFileStorage()
    use_case = CreateTicketUseCase(repo=repo, files=storage)
    uploads = [f for f in files if f and f.filename]

    from schemas.support import CreateTicketRequest
    payload = CreateTicketRequest(subject=subject, category=category, message=message)
    ticket = await use_case.execute(user=user, data=payload, uploads=uploads)
    return ticket_to_detail(ticket)


@router.get("/support/tickets/{ticket_id}", response_model=SupportTicketDetail)
async def get_my_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SupportTicketDetail:
    "Возвращает детали тикета с историей сообщений; 404 если тикет чужой."
    use_case = GetTicketForUserUseCase(SupportRepository(db))
    ticket = await use_case.execute(ticket_id=ticket_id, user_id=user_id)
    return ticket_to_detail(ticket)


@router.post(
    "/support/tickets/{ticket_id}/messages",
    response_model=SupportTicketDetail,
    dependencies=[Depends(rate_limit("support_reply", max_calls=10, window_seconds=60))],
)
async def reply_to_my_ticket(
    ticket_id: int,
    text: str = Form(default="", max_length=5000),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> SupportTicketDetail:
    "Добавляет ответ пользователя в тикет поддержки с опциональными вложениями."
    user = await get_user_or_404(db, user_id)
    repo = SupportRepository(db)
    storage = SupportFileStorage()
    use_case = ReplyToTicketUseCase(repo=repo, files=storage)
    uploads = [f for f in files if f and f.filename]
    ticket = await use_case.execute(
        ticket_id=ticket_id, user=user, text=text, uploads=uploads
    )
    return ticket_to_detail(ticket)
