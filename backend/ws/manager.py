from collections import defaultdict
from typing import Any

from fastapi import WebSocket
from starlette.websockets import WebSocketState

from ws.pubsub import ws_pubsub


CHAT_CHANNEL = "ws:chat:events"


class ChatConnectionManager:
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
        await ws_pubsub.publish(CHAT_CHANNEL, {"chat_id": chat_id, "data": data})

    async def handle_event(self, payload: dict[str, Any]) -> None:
        chat_id = payload.get("chat_id")
        data = payload.get("data")
        if not isinstance(chat_id, int) or not isinstance(data, dict):
            return
        await self._local_broadcast(chat_id, data)

    async def _local_broadcast(self, chat_id: int, data: dict[str, Any]) -> None:
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
