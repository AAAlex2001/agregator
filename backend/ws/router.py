from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select

from database.database import AsyncSessionLocal
from models.chat import Chat
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
async def chat_websocket(websocket: WebSocket, chat_id: int, user_id: int) -> None:
    async with AsyncSessionLocal() as db:
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
