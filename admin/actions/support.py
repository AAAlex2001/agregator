"Роуты раздела поддержки: ответ от админа в тикет и закрытие тикета."

from datetime import UTC, datetime

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from starlette.requests import Request
from starlette.responses import RedirectResponse

from db import SessionLocal
from helpers.support_files import save_support_attachments_sync
from models import (
    Notification,
    NotificationType,
    SupportTicket,
    SupportTicketMessage,
    TicketMessageAuthor,
    TicketStatus,
    User,
)


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела поддержки в переданном приложении FastAPI."

    @app.post("/admin-actions/support-tickets/{ticket_id}/reply", name="support_ticket_reply")
    async def support_ticket_reply(
        request: Request,
        ticket_id: int,
        text: str = Form(""),
        files: list[UploadFile] = File(default=[]),
    ) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        cleaned = (text or "").strip()
        attachments = save_support_attachments_sync(ticket_id, files)

        if not cleaned and not attachments:
            return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)

        with SessionLocal() as db:
            ticket = db.get(SupportTicket, ticket_id)
            if ticket is None:
                raise HTTPException(status_code=404, detail="Тикет не найден")
            if ticket.status == TicketStatus.CLOSED:
                return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)

            now = datetime.now(UTC)
            message = SupportTicketMessage(
                ticket_id=ticket.id,
                author_kind=TicketMessageAuthor.ADMIN,
                author_user_id=None,
                author_name="Поддержка",
                text=cleaned,
                attachments=attachments,
                created_at=now,
            )
            db.add(message)
            ticket.status = TicketStatus.ANSWERED
            ticket.has_unread_for_user = True
            ticket.has_unread_for_admin = False
            ticket.updated_at = now

            if cleaned:
                preview = (cleaned[:160] + "…") if len(cleaned) > 160 else cleaned
            else:
                preview = f"Прикреплено файлов: {len(attachments)}"
            notification = Notification(
                user_id=ticket.user_id,
                type=NotificationType.SUPPORT_REPLY,
                payload={
                    "ticket_number": ticket.number,
                    "subject": ticket.subject,
                    "preview": preview,
                },
                action_url=f"/support?ticket={ticket.id}",
                is_read=False,
                created_at=now,
            )
            db.add(notification)
            db.query(User).filter(User.id == ticket.user_id).update(
                {User.notification_unread_count: User.notification_unread_count + 1},
                synchronize_session=False,
            )

            db.commit()

        return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}#stp-reply", status_code=303)

    @app.get("/admin-actions/support-tickets/{ticket_id}/close", name="support_ticket_close")
    async def support_ticket_close(request: Request, ticket_id: int) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        with SessionLocal() as db:
            ticket = db.get(SupportTicket, ticket_id)
            if ticket is None:
                raise HTTPException(status_code=404, detail="Тикет не найден")
            ticket.status = TicketStatus.CLOSED
            ticket.has_unread_for_admin = False
            ticket.updated_at = datetime.now(UTC)
            db.commit()

        return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)
