import json
import os
from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select

from database.database import AsyncSessionLocal
from models.chat import Chat
from models.session import Session
from schemas.chat import ExpertRoomTypingPayload, WsExpertRoomTyping
from services.chats import (
    AuthenticateExpertRoomWsUseCase,
    ExpertRoomRepository,
    WsCloseError,
)
from ws.expert_room_manager import expert_room_manager
from ws.manager import chat_manager

router = APIRouter(prefix="/ws")

ALLOWED_WS_ORIGINS = {
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS", "https://plus-resurs.com,http://localhost:3000"
    ).split(",")
    if o.strip()
} | {"https://tg.plus-resurs.com"}
MAX_WS_PAYLOAD_BYTES = 100 * 1024
SESSION_RECHECK_INTERVAL = 50


@router.websocket("/chats/{chat_uuid}")
async def chat_websocket(websocket: WebSocket, chat_uuid: str) -> None:
    origin = websocket.headers.get("origin", "")
    if origin and origin not in ALLOWED_WS_ORIGINS:
        await websocket.close(code=4001)
        return

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

        now = datetime.now(UTC)
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

    message_count = 0
    try:
        while True:
            raw = await websocket.receive_text()
            if len(raw.encode("utf-8")) > MAX_WS_PAYLOAD_BYTES:
                await websocket.close(code=1009)
                break
            message_count += 1
            if message_count % SESSION_RECHECK_INTERVAL == 0:
                async with AsyncSessionLocal() as db:
                    sess = await db.execute(
                        select(Session).where(Session.session_id == session_id)
                    )
                    session = sess.scalars().first()
                    now = datetime.now(UTC)
                    if (
                        session is None
                        or now > session.max_expires_at
                        or now > session.expires_at
                    ):
                        await websocket.close(code=4001)
                        break
    except (WebSocketDisconnect, Exception):
        pass
    finally:
        chat_manager.disconnect(chat_id, user_id, websocket)
        await chat_manager.broadcast(chat_id, {
            "event": "chat_presence",
            "data": {"online_user_ids": chat_manager.get_online_user_ids(chat_id)},
        })


@router.websocket("/expert-room")
async def expert_room_websocket(websocket: WebSocket) -> None:
    origin = websocket.headers.get("origin", "")
    if origin and origin not in ALLOWED_WS_ORIGINS:
        await websocket.close(code=4001)
        return

    async with AsyncSessionLocal() as db:
        try:
            info = await AuthenticateExpertRoomWsUseCase(
                ExpertRoomRepository(db)
            ).execute(websocket.cookies.get("session_id"))
        except WsCloseError as exc:
            await websocket.close(code=exc.code)
            return

    typing_event = WsExpertRoomTyping(
        data=ExpertRoomTypingPayload(user_id=info.user_id, user_name=info.display_name)
    )

    await expert_room_manager.connect(websocket, info.user_id, info.display_name)
    parse_failures = 0
    message_count = 0
    session_id = websocket.cookies.get("session_id")
    try:
        while True:
            raw = await websocket.receive_text()
            if len(raw.encode("utf-8")) > MAX_WS_PAYLOAD_BYTES:
                await websocket.close(code=1009)
                break
            message_count += 1
            if message_count % SESSION_RECHECK_INTERVAL == 0:
                async with AsyncSessionLocal() as db:
                    try:
                        await AuthenticateExpertRoomWsUseCase(
                            ExpertRoomRepository(db)
                        ).execute(session_id)
                    except WsCloseError:
                        await websocket.close(code=4001)
                        break
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                parse_failures += 1
                if parse_failures > 5:
                    await websocket.close(code=1002)
                    break
                continue
            parse_failures = 0
            if isinstance(payload, dict) and payload.get("type") == "typing":
                await expert_room_manager.broadcast(typing_event, except_ws=websocket)
    except WebSocketDisconnect:
        pass
    finally:
        expert_room_manager.disconnect(websocket)
