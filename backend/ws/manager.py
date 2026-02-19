from typing import Any
from collections import defaultdict

from fastapi import WebSocket
from starlette.websockets import WebSocketState


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

    async def broadcast(self, data: dict[str, Any]) -> None:
        stale: list[WebSocket] = []
        for connection in self.connections:
            if connection.client_state != WebSocketState.CONNECTED:
                stale.append(connection)
                continue
            try:
                await connection.send_json(data)
            except Exception:
                stale.append(connection)
        for connection in stale:
            self.connections.discard(connection)


order_manager = ConnectionManager()


class ChatConnectionManager:
    """Room-based WebSocket manager: chat_id -> user_id -> set[WebSocket]."""

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
        room = self.rooms.get(chat_id)
        if not room:
            return
        stale: list[tuple[int, WebSocket]] = []
        for user_id, sockets in room.items():
            for conn in sockets:
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
