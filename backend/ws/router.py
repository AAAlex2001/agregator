from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import AsyncSessionLocal
from services.chat import ChatService
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
    db: AsyncSession = AsyncSessionLocal()
    service = ChatService(db)

    try:
        await service.get_chat_for_actor(chat_id=chat_id, actor_id=user_id)
        await chat_manager.connect(chat_id=chat_id, user_id=user_id, websocket=websocket)

        await chat_manager.send_user(
            chat_id,
            user_id,
            {
                "event": "chat_presence",
                "data": {
                    "chat_id": chat_id,
                    "online_user_ids": sorted(chat_manager.get_online_user_ids(chat_id)),
                    "both_online": chat_manager.has_two_participants(chat_id),
                },
            },
        )
        await chat_manager.broadcast_chat(
            chat_id,
            {
                "event": "chat_presence",
                "data": {
                    "chat_id": chat_id,
                    "online_user_ids": sorted(chat_manager.get_online_user_ids(chat_id)),
                    "both_online": chat_manager.has_two_participants(chat_id),
                },
            },
        )

        while True:
            payload = await websocket.receive_json()
            event = payload.get("event")

            if event == "send_message":
                text = str(payload.get("text", ""))
                message = await service.send_message(chat_id=chat_id, sender_id=user_id, text=text)
                await chat_manager.send_user(
                    chat_id,
                    user_id,
                    {
                        "event": "message_saved",
                        "data": message.model_dump(mode="json"),
                    },
                )
                await chat_manager.broadcast_chat(
                    chat_id,
                    {
                        "event": "chat_message",
                        "data": message.model_dump(mode="json"),
                    },
                    require_two_participants=True,
                )
    except WebSocketDisconnect:
        chat_manager.disconnect(chat_id=chat_id, user_id=user_id, websocket=websocket)
    except Exception:
        chat_manager.disconnect(chat_id=chat_id, user_id=user_id, websocket=websocket)
    finally:
        await chat_manager.broadcast_chat(
            chat_id,
            {
                "event": "chat_presence",
                "data": {
                    "chat_id": chat_id,
                    "online_user_ids": sorted(chat_manager.get_online_user_ids(chat_id)),
                    "both_online": chat_manager.has_two_participants(chat_id),
                },
            },
        )
        await db.close()
