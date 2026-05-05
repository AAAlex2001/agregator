from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select

from database.database import AsyncSessionLocal
from models.chat import Chat
from models.session import Session
from ws.manager import chat_manager

router = APIRouter(prefix="/ws")


@router.websocket("/chats/{chat_uuid}")
async def chat_websocket(websocket: WebSocket, chat_uuid: str) -> None:
    session_id = websocket.cookies.get("session_id")
    if not session_id:
        await websocket.close(code=4001)
        return

    try:
        parsed_uuid = UUID(chat_uuid)
    except (ValueError, TypeError):
        await websocket.close(code=4003)
        return

    user_id: int
    chat_id: int

    async with AsyncSessionLocal() as db:
        sess = await db.execute(select(Session).where(Session.session_id == session_id))
        session = sess.scalars().first()
        if not session:
            await websocket.close(code=4001)
            return

        now = datetime.now(timezone.utc)
        if now > session.max_expires_at or now > session.expires_at:
            await websocket.close(code=4001)
            return

        user_id = session.user_id

        row = await db.execute(
            select(Chat.id).where(
                Chat.uuid == parsed_uuid,
                or_(Chat.customer_id == user_id, Chat.expert_id == user_id),
            )
        )
        resolved_chat_id = row.scalar_one_or_none()

    if resolved_chat_id is None:
        await websocket.close(code=4003)
        return

    chat_id = resolved_chat_id

    await chat_manager.connect(chat_id, user_id, websocket)
    await chat_manager.broadcast(chat_id, {
        "event": "chat_presence",
        "data": {"online_user_ids": chat_manager.get_online_user_ids(chat_id)},
    })

    try:
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        pass
    finally:
        chat_manager.disconnect(chat_id, user_id, websocket)
        await chat_manager.broadcast(chat_id, {
            "event": "chat_presence",
            "data": {"online_user_ids": chat_manager.get_online_user_ids(chat_id)},
        })
