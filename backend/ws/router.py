from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime, timezone
from sqlalchemy import or_, select

from database.database import AsyncSessionLocal
from models.chat import Chat
from models.session import Session
from ws.manager import chat_manager, order_manager

router = APIRouter(prefix="/ws")


@router.websocket("/orders")
async def orders_websocket(websocket: WebSocket) -> None:
    await order_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        order_manager.disconnect(websocket)
    except Exception:
        order_manager.disconnect(websocket)


@router.websocket("/chats/{chat_id}")
async def chat_websocket(websocket: WebSocket, chat_id: int) -> None:
    session_id = websocket.cookies.get("session_id")
    if not session_id:
        await websocket.close(code=4001)
        return

    async with AsyncSessionLocal() as db:
        sess = await db.execute(
            select(Session).where(Session.session_id == session_id)
        )
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
                Chat.id == chat_id,
                or_(Chat.customer_id == user_id, Chat.expert_id == user_id),
            )
        )
        if not row.scalars().first():
            await websocket.close(code=4003)
            return

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
