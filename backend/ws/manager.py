import logging
from collections import defaultdict
from typing import Any

from fastapi import WebSocket
from pydantic import ValidationError
from starlette.websockets import WebSocketState

from ws.pubsub import ws_pubsub
from ws.schemas import ChatBroadcastPayload

log = logging.getLogger(__name__)

CHAT_CHANNEL = "ws:chat:events"


class ChatConnectionManager:
    "Room-based WebSocket-менеджер: chat_id → user_id → сокеты. Broadcast через Redis pub/sub."

    def __init__(self) -> None:
        self.rooms: dict[int, dict[int, set[WebSocket]]] = defaultdict(lambda: defaultdict(set))

    async def connect(self, chat_id: int, user_id: int, ws: WebSocket) -> None:
        await ws.accept()
        self.rooms[chat_id][user_id].add(ws)

    def disconnect(self, chat_id: int, user_id: int, ws: WebSocket) -> None:
        room = self.rooms.get(chat_id)
        if not room:
            return
        sockets = room.get(user_id)
        if sockets:
            sockets.discard(ws)
            if not sockets:
                room.pop(user_id, None)
        if not room:
            self.rooms.pop(chat_id, None)

    def get_online_user_ids(self, chat_id: int) -> list[int]:
        room = self.rooms.get(chat_id)
        if not room:
            return []
        return sorted(uid for uid, socks in room.items() if socks)

    async def broadcast(self, chat_id: int, data: dict[str, Any]) -> None:
        "Публикует событие в Redis. На всех репликах сработает handle_event."
        await ws_pubsub.publish(CHAT_CHANNEL, {"chat_id": chat_id, "data": data})

    async def handle_event(self, payload: dict[str, Any]) -> None:
        "Хендлер pubsub-канала: рассылает событие по локальным сокетам этой реплики."
        try:
            event = ChatBroadcastPayload.model_validate(payload)
        except ValidationError as exc:
            log.warning("ws chat: invalid broadcast payload rejected: %s", exc)
            return
        await self.local_broadcast(event.chat_id, event.data)

    async def local_broadcast(self, chat_id: int, data: dict[str, Any]) -> None:
        "Прямая рассылка по сокетам, которые в памяти этой реплики."
        room = self.rooms.get(chat_id)
        if not room:
            return
        stale: list[tuple[int, WebSocket]] = []
        for user_id, sockets in list(room.items()):
            for conn in list(sockets):
                if conn.client_state != WebSocketState.CONNECTED:
                    stale.append((user_id, conn))
                    continue
                try:
                    await conn.send_json(data)
                except Exception:
                    stale.append((user_id, conn))
        for uid, conn in stale:
            self.disconnect(chat_id, uid, conn)


chat_manager = ChatConnectionManager()
