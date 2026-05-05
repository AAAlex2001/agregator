from datetime import datetime, timezone

from fastapi import HTTPException, status

from models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
    TicketMessageAuthor,
    TicketStatus,
)

from ..repository import SupportRepository


class AdminReplyUseCase:
    "Ответ администратора в тикет (используется из админки)."

    def __init__(self, repo: SupportRepository):
        self.repo = repo

    async def execute(
        self,
        ticket_id: int,
        admin_name: str,
        text: str,
        attachments: list[dict] | None = None,
    ) -> SupportTicket:
        ticket = await self.repo.get_by_id(ticket_id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Обращение не найдено",
            )
        if ticket.status == TicketStatus.CLOSED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Обращение закрыто. Откройте новое.",
            )

        cleaned = (text or "").strip()
        attachments_list = attachments or []
        if not cleaned and not attachments_list:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Введите сообщение или прикрепите файл",
            )

        message = SupportTicketMessage(
            ticket_id=ticket.id,
            author_kind=TicketMessageAuthor.ADMIN,
            author_user_id=None,
            author_name=admin_name or "Поддержка",
            text=cleaned,
            attachments=attachments_list,
            created_at=datetime.now(timezone.utc),
        )
        await self.repo.add_message(message)

        ticket.status = TicketStatus.ANSWERED
        ticket.has_unread_for_user = True
        ticket.has_unread_for_admin = False
        ticket.updated_at = datetime.now(timezone.utc)

        await self.repo.flush()
        return ticket


class CloseTicketUseCase:
    def __init__(self, repo: SupportRepository):
        self.repo = repo

    async def execute(self, ticket_id: int) -> SupportTicket:
        ticket = await self.repo.get_by_id(ticket_id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Обращение не найдено",
            )
        ticket.status = TicketStatus.CLOSED
        ticket.has_unread_for_admin = False
        ticket.updated_at = datetime.now(timezone.utc)
        await self.repo.flush()
        return ticket
