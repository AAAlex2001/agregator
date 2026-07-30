"Роуты модерации чата исполнителей: удаление сообщения и бан пользователя."

from fastapi import FastAPI, Form
from starlette.requests import Request
from starlette.responses import RedirectResponse

from db import SessionLocal
from models import ExpertRoomBan, ExpertRoomMessage


def setup(app: FastAPI) -> None:
    "Регистрирует роуты модерации чата исполнителей в переданном приложении FastAPI."

    @app.post(
        "/admin-actions/expert-room/messages/{message_id}/delete",
        name="expert_room_message_delete",
    )
    async def expert_room_message_delete(request: Request, message_id: int) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        with SessionLocal() as db:
            message = db.get(ExpertRoomMessage, message_id)
            if message is not None:
                db.delete(message)
                db.commit()

        return RedirectResponse("/admin/expert-room-chat", status_code=303)

    @app.post("/admin-actions/expert-room/users/{user_id}/ban", name="expert_room_user_ban")
    async def expert_room_user_ban(
        request: Request,
        user_id: int,
        reason: str = Form(""),
    ) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        cleaned_reason = (reason or "").strip()[:500]

        with SessionLocal() as db:
            existing = db.query(ExpertRoomBan).filter(ExpertRoomBan.user_id == user_id).first()
            if existing is not None:
                existing.reason = cleaned_reason
            else:
                db.add(ExpertRoomBan(user_id=user_id, reason=cleaned_reason))
            db.commit()

        return RedirectResponse("/admin/expert-room-chat", status_code=303)
